function isMobile() {
    return /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
}

function floatTo16BitPCM(float32) {
    const out = new Int16Array(float32.length);
    for (let i = 0; i < float32.length; i++) {
        const s = Math.max(-1, Math.min(1, float32[i]));
        out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return out;
}

function computeDbWindows(samples, sampleRate, windowMs) {
    const windowSize = Math.max(1, Math.round((sampleRate * windowMs) / 1000));
    const windowCount = Math.ceil(samples.length / windowSize);
    const db = new Float32Array(windowCount);
    for (let w = 0; w < windowCount; w++) {
        const start = w * windowSize;
        const end = Math.min(start + windowSize, samples.length);
        let sumSq = 0;
        for (let i = start; i < end; i++) {
            sumSq += samples[i] * samples[i];
        }
        const rms = Math.sqrt(sumSq / (end - start));
        db[w] = rms > 0 ? 20 * Math.log10(rms) : -Infinity;
    }
    return { db, windowSize };
}

// Mirrors ffmpeg's `silenceremove`: leading silence is trimmed down to
// startPadSec, and any other silent run (mid-file gaps, trailing silence)
// longer than stopPadSec is trimmed down to stopPadSec.
function removeSilence(samples, sampleRate, opts) {
    const {
        thresholdDb = -40,
        startPadSec = 1.5,
        stopPadSec = 2.0,
        windowMs = 20,
    } = opts || {};

    const { db, windowSize } = computeDbWindows(samples, sampleRate, windowMs);

    const silentFlags = new Uint8Array(db.length);
    for (let i = 0; i < db.length; i++) silentFlags[i] = db[i] < thresholdDb ? 1 : 0;

    const startPadWindows = Math.round((startPadSec * 1000) / windowMs);
    const stopPadWindows = Math.round((stopPadSec * 1000) / windowMs);

    const keepWindow = new Uint8Array(silentFlags.length).fill(1);

    let i = 0;
    while (i < silentFlags.length) {
        if (!silentFlags[i]) {
            i++;
            continue;
        }
        let j = i;
        while (j < silentFlags.length && silentFlags[j]) j++;
        const runLen = j - i;
        const isLeading = i === 0;
        const pad = isLeading ? startPadWindows : stopPadWindows;
        if (runLen > pad) {
            if (isLeading) {
                // keep only the tail `pad` windows, right before sound starts
                for (let w = i; w < j - pad; w++) keepWindow[w] = 0;
            } else {
                // keep only the head `pad` windows, right after sound ends
                for (let w = i + pad; w < j; w++) keepWindow[w] = 0;
            }
        }
        i = j;
    }

    let outLength = 0;
    for (let w = 0; w < keepWindow.length; w++) {
        if (keepWindow[w]) {
            const start = w * windowSize;
            const end = Math.min(start + windowSize, samples.length);
            outLength += end - start;
        }
    }

    // Safety net: don't let an over-aggressive classification wipe out a file.
    if (outLength < sampleRate * 0.5) {
        return samples;
    }

    const out = new Float32Array(outLength);
    let pos = 0;
    for (let w = 0; w < keepWindow.length; w++) {
        if (keepWindow[w]) {
            const start = w * windowSize;
            const end = Math.min(start + windowSize, samples.length);
            out.set(samples.subarray(start, end), pos);
            pos += end - start;
        }
    }
    return out;
}

// Decodes the mp3, then downmixes/resamples to mono 8kHz while applying the
// same volume boost + bandpass (200-3000Hz) the old ffmpeg pipeline used —
// all native Web Audio API, no ffmpeg/wasm/worker involved.
async function decodeAndClean(audioCtx, arrayBuffer) {
    const decoded = await audioCtx.decodeAudioData(arrayBuffer);
    const targetRate = 8000;
    const offlineCtx = new OfflineAudioContext(1, Math.ceil(decoded.duration * targetRate), targetRate);

    const source = offlineCtx.createBufferSource();
    source.buffer = decoded;

    const gain = offlineCtx.createGain();
    gain.gain.value = 2.0;

    const highpass = offlineCtx.createBiquadFilter();
    highpass.type = "highpass";
    highpass.frequency.value = 200;

    const lowpass = offlineCtx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 3000;

    source.connect(gain).connect(highpass).connect(lowpass).connect(offlineCtx.destination);
    source.start(0);

    const rendered = await offlineCtx.startRendering();
    return rendered.getChannelData(0);
}

async function encodeMp3(samples, sampleRate, progressCb) {
    const pcm = floatTo16BitPCM(samples);
    const encoder = new lamejs.Mp3Encoder(1, sampleRate, 32);
    const chunks = [];
    const chunkSize = sampleRate * 2; // ~2s per chunk; yields between chunks so long files don't freeze the tab

    for (let i = 0; i < pcm.length; i += chunkSize) {
        const chunk = pcm.subarray(i, i + chunkSize);
        const mp3buf = encoder.encodeBuffer(chunk);
        if (mp3buf.length > 0) chunks.push(mp3buf);
        if (progressCb) progressCb(i / pcm.length);
        await new Promise((resolve) => setTimeout(resolve, 0));
    }
    const end = encoder.flush();
    if (end.length > 0) chunks.push(end);

    return new Blob(chunks, { type: "audio/mpeg" });
}

document.addEventListener("DOMContentLoaded", async () => {
    console.log("Silence Remover - v3.0.0 (native Web Audio, no ffmpeg)");
    const mobileMessage = document.getElementById("mobile-message");
    if (isMobile()) {
        mobileMessage.style.display = "flex";
    }

    if (!window.lamejs) {
        console.error("lamejs library loading failed!");
        return;
    }

    const dropArea = document.getElementById("drop-area");
    const fileInput = document.getElementById("file-input");
    const fileList = document.getElementById("file-list");
    const processButton = document.getElementById("process-button");
    const loadingIndicator = document.getElementById("loading-indicator");
    const downloadAllButton = document.getElementById("download-all-button");
    const bmcButton = document.getElementById("bmc-button");

    let filesArray = [];
    let isProcessing = false;
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    dropArea.addEventListener("dragover", (event) => {
        event.preventDefault();
    });

    dropArea.addEventListener("dragleave", () => {
    });

    dropArea.addEventListener("drop", async (event) => {
        event.preventDefault();
        if (isProcessing) {
            alert("Processing is in progress");
            return;
        }
        const files = event.dataTransfer.files;
        addFiles(files);
    });

    fileInput.addEventListener("change", async (event) => {
        const files = event.target.files;
        addFiles(files);
    });

    function addFiles(files) {
        for (let file of files) {
            if (file.type === "audio/mpeg") {
                filesArray.push(file);
                const listItem = document.createElement("li");
                listItem.classList.add("file-item");

                const fileNameSpan = document.createElement("span");
                fileNameSpan.textContent = file.name;

                const progressBar = document.createElement("div");
                progressBar.classList.add("progress-bar");
                const progress = document.createElement("span");
                progressBar.appendChild(progress);

                listItem.appendChild(fileNameSpan);
                listItem.appendChild(progressBar);
                fileList.appendChild(listItem);
            }
        }
        if (filesArray.length > 0) {
            processButton.style.display = "inline-block";
        }
    }

    processButton.addEventListener("click", async () => {
        isProcessing = true;
        processButton.style.display = "none";
        mobileMessage.style.display = "none";
        document.getElementById("file-label").style.display = "none";
        loadingIndicator.style.display = "block";

        let processedFiles = [];

        for (let i = 0; i < filesArray.length; i++) {
            const file = filesArray[i];
            const listItem = fileList.children[i];
            const progress = listItem.querySelector(".progress-bar span");

            try {
                const fileName = file.name;
                const outputMp3 = fileName.replace(".mp3", "_cleaned.mp3");

                const arrayBuffer = await file.arrayBuffer();
                progress.style.width = "20%";

                const filtered = await decodeAndClean(audioCtx, arrayBuffer);
                progress.style.width = "45%";

                const trimmed = removeSilence(filtered, 8000, {
                    thresholdDb: -40,
                    startPadSec: 1.5,
                    stopPadSec: 2.0,
                });
                progress.style.width = "65%";

                const audioBlob = await encodeMp3(trimmed, 8000, (frac) => {
                    progress.style.width = `${65 + Math.round(frac * 35)}%`;
                });
                progress.style.width = "100%";

                listItem.innerHTML = "";
                const cleanedFileName = document.createElement("span");
                cleanedFileName.textContent = outputMp3;
                listItem.appendChild(cleanedFileName);

                const downloadLink = document.createElement("a");
                downloadLink.href = URL.createObjectURL(audioBlob);
                downloadLink.download = outputMp3;
                downloadLink.textContent = "Download";
                downloadLink.classList.add("button");

                if (!isMobile()) {
                    listItem.appendChild(downloadLink);
                }

                processedFiles.push({ name: outputMp3, blob: audioBlob });
            } catch (error) {
                console.error("[YB ERR] Error while processing file:", error);
            }
        }

        loadingIndicator.style.display = "none";
        bmcButton.style.display = "inline-flex";

        if (processedFiles.length > 0) {
            downloadAllButton.classList.remove("hidden");
            downloadAllButton.addEventListener("click", () => {
                processedFiles.forEach((file) => {
                    const downloadLink = document.createElement("a");
                    downloadLink.href = URL.createObjectURL(file.blob);
                    downloadLink.download = file.name;
                    downloadLink.click();
                });
            });
        }
        isProcessing = false;
    });
});
