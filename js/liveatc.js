document.addEventListener("DOMContentLoaded", async () => {
    if (!window.FFmpeg || !window.FFmpeg.createFFmpeg) {
        console.error("FFmpeg 라이브러리가 로드되지 않았습니다.");
        return;
    }

    const { createFFmpeg } = window.FFmpeg;
    const ffmpeg = createFFmpeg({
        log: true,
        wasmPath: '/assets/ffmpeg/ffmpeg-core.js'
    });

    console.log("FFmpeg 인스턴스 생성 완료:", ffmpeg);
    await ffmpeg.load();
    console.log("FFmpeg 로드 완료!");

    const dropArea = document.getElementById("drop-area");
    const fileInput = document.getElementById("file-input");
    const fileList = document.getElementById("file-list");

    dropArea.addEventListener("dragover", (event) => {
        event.preventDefault();
        dropArea.style.background = "#f0f0f0";
    });

    dropArea.addEventListener("dragleave", () => {
        dropArea.style.background = "";
    });

    dropArea.addEventListener("drop", async (event) => {
        event.preventDefault();
        dropArea.style.background = "";
        const files = event.dataTransfer.files;
        await processFiles(files);
    });

    fileInput.addEventListener("change", async (event) => {
        const files = event.target.files;
        await processFiles(files);
    });

    async function processFiles(files) {
        for (let file of files) {
            try {
                const fileName = file.name;
                const inputMp3 = fileName;
                const tempWav = `temp.wav`;
                const cleanedWav = `cleaned.wav`;
                const outputMp3 = fileName.replace(".mp3", "_cleaned.mp3");

                // 파일을 Uint8Array로 변환 후 FFmpeg에 쓰기
                const fileData = new Uint8Array(await file.arrayBuffer());
                ffmpeg.FS('writeFile', inputMp3, fileData);

                await ffmpeg.run("-i", inputMp3, "-acodec", "pcm_s16le", "-ar", "8000", "-ac", "1", tempWav);
                await ffmpeg.run("-i", tempWav, "-af", "volume=2.0, silenceremove=start_periods=1:start_threshold=-40dB:start_silence=1.5:stop_threshold=-40dB:stop_silence=2:stop_periods=-1", cleanedWav);
                await ffmpeg.run("-i", cleanedWav, "-codec:a", "libmp3lame", "-b:a", "64k", "-ar", "8000", "-ac", "1", outputMp3);

                const processedData = ffmpeg.FS('readFile', outputMp3);
                const audioBlob = new Blob([processedData.buffer], { type: "audio/mpeg" });
                const downloadLink = document.createElement("a");
                downloadLink.href = URL.createObjectURL(audioBlob);
                downloadLink.download = outputMp3;
                downloadLink.textContent = `다운로드: ${outputMp3}`;
                fileList.appendChild(downloadLink);
            } catch (error) {
                console.error("파일 처리 중 오류 발생:", error);
            }
        }
    }
});
