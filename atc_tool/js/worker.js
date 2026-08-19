importScripts("https://cdn.jsdelivr.net/npm/lamejs@1.2.0/lame.min.js");

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

function encodeMp3(samples, sampleRate, onProgress) {
    const pcm = floatTo16BitPCM(samples);
    const encoder = new lamejs.Mp3Encoder(1, sampleRate, 32);
    const chunks = [];
    const chunkSize = sampleRate * 2; // ~2s per chunk

    let total = 0;
    for (let i = 0; i < pcm.length; i += chunkSize) {
        const chunk = pcm.subarray(i, i + chunkSize);
        const buf = encoder.encodeBuffer(chunk);
        if (buf.length > 0) {
            chunks.push(buf);
            total += buf.length;
        }
        if (onProgress) onProgress(i / pcm.length);
    }
    const end = encoder.flush();
    if (end.length > 0) {
        chunks.push(end);
        total += end.length;
    }

    const out = new Uint8Array(total);
    let pos = 0;
    for (const c of chunks) {
        out.set(c, pos);
        pos += c.length;
    }
    return out;
}

self.onmessage = (e) => {
    const { id, samples, sampleRate } = e.data;
    try {
        const trimmed = removeSilence(samples, sampleRate, {
            thresholdDb: -40,
            startPadSec: 1.5,
            stopPadSec: 2.0,
        });
        self.postMessage({ id, type: "progress", value: 0.3 });

        const mp3Bytes = encodeMp3(trimmed, sampleRate, (frac) => {
            self.postMessage({ id, type: "progress", value: 0.3 + frac * 0.7 });
        });

        self.postMessage({ id, type: "done", mp3Bytes }, [mp3Bytes.buffer]);
    } catch (error) {
        self.postMessage({ id, type: "error", message: String((error && error.message) || error) });
    }
};
