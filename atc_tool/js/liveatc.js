function isMobile() {
    return /Mobi|Android|iPhone|iPad|iPod|Windows Phone/i.test(navigator.userAgent);
}

// Runs async jobs with at most `concurrency` in flight at once — used to
// bound how many files are decoded (a memory-heavy step) at the same time.
function createLimiter(concurrency) {
    let active = 0;
    const queue = [];
    const runNext = () => {
        if (active >= concurrency || queue.length === 0) return;
        active++;
        const { fn, resolve, reject } = queue.shift();
        fn().then(resolve, reject).finally(() => {
            active--;
            runNext();
        });
    };
    return (fn) =>
        new Promise((resolve, reject) => {
            queue.push({ fn, resolve, reject });
            runNext();
        });
}

// Pool of workers that do silence-removal + mp3 encoding (the slow, CPU-bound
// part) so multiple files can process in parallel across CPU cores.
class WorkerPool {
    constructor(url, size) {
        this.idle = Array.from({ length: size }, () => new Worker(url));
        this.queue = [];
        this.pending = new Map();
        this.idle.forEach((worker) => {
            worker.onmessage = (e) => {
                const { id, type } = e.data;
                const task = this.pending.get(id);
                if (!task) return;
                if (type === "progress") {
                    task.onProgress(e.data.value);
                } else if (type === "done") {
                    this.pending.delete(id);
                    task.resolve(e.data.mp3Bytes);
                    this._release(worker);
                } else if (type === "error") {
                    this.pending.delete(id);
                    task.reject(new Error(e.data.message));
                    this._release(worker);
                }
            };
        });
    }

    _release(worker) {
        const next = this.queue.shift();
        if (next) {
            this._dispatch(worker, next);
        } else {
            this.idle.push(worker);
        }
    }

    _dispatch(worker, task) {
        this.pending.set(task.id, task);
        worker.postMessage({ id: task.id, samples: task.samples, sampleRate: task.sampleRate }, [task.samples.buffer]);
    }

    run(id, samples, sampleRate, onProgress) {
        return new Promise((resolve, reject) => {
            const task = { id, samples, sampleRate, onProgress, resolve, reject };
            const worker = this.idle.pop();
            if (worker) {
                this._dispatch(worker, task);
            } else {
                this.queue.push(task);
            }
        });
    }

    terminate() {
        this.idle.forEach((w) => w.terminate());
    }
}

// Decodes the mp3, then downmixes/resamples to mono 8kHz while applying the
// same volume boost + bandpass (200-3000Hz) the old ffmpeg pipeline used —
// all native Web Audio API, no ffmpeg/wasm involved.
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

document.addEventListener("DOMContentLoaded", async () => {
    console.log("Silence Remover - v4.0.0 (native Web Audio + worker pool, no ffmpeg)");
    const mobileMessage = document.getElementById("mobile-message");
    if (isMobile()) {
        mobileMessage.style.display = "flex";
    }

    const dropArea = document.getElementById("drop-area");
    const fileInput = document.getElementById("file-input");
    const fileList = document.getElementById("file-list");
    const processButton = document.getElementById("process-button");
    const loadingIndicator = document.getElementById("loading-indicator");
    const downloadAllButton = document.getElementById("download-all-button");

    let filesArray = [];
    let isProcessing = false;
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const decodeLimiter = createLimiter(1);

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

        const poolSize = Math.max(1, Math.min(navigator.hardwareConcurrency || 4, 4, filesArray.length));
        const pool = new WorkerPool("/atc_tool/js/worker.js", poolSize);

        const tasks = filesArray.map((file, i) => {
            const listItem = fileList.children[i];
            const progress = listItem.querySelector(".progress-bar span");

            return (async () => {
                try {
                    const fileName = file.name;
                    const outputMp3 = fileName.replace(".mp3", "_cleaned.mp3");

                    const arrayBuffer = await file.arrayBuffer();
                    progress.style.width = "10%";

                    const filtered = await decodeLimiter(() => decodeAndClean(audioCtx, arrayBuffer));
                    progress.style.width = "25%";

                    const mp3Bytes = await pool.run(i, filtered, 8000, (frac) => {
                        progress.style.width = `${25 + Math.round(frac * 75)}%`;
                    });
                    progress.style.width = "100%";

                    const audioBlob = new Blob([mp3Bytes], { type: "audio/mpeg" });

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

                    return { name: outputMp3, blob: audioBlob };
                } catch (error) {
                    console.error("[YB ERR] Error while processing file:", error);
                    return null;
                }
            })();
        });

        const results = await Promise.all(tasks);
        pool.terminate();

        const processedFiles = results.filter(Boolean);

        loadingIndicator.style.display = "none";

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
