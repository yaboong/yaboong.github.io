document.addEventListener("DOMContentLoaded", async () => {
    const ffmpeg = new window.FFmpegWASM.FFmpeg();
    await ffmpeg.load();

    const logContainer = document.getElementById("log-container");
    logContainer.style.display = "none";

    ffmpeg.on("log", ({ type, message }) => {
        const logMessage = document.createElement("div");
        logMessage.textContent = `[${type}] ${message}`;
        logContainer.appendChild(logMessage);
        logContainer.scrollTop = logContainer.scrollHeight;
    });

    const dropArea = document.getElementById("drop-area");
    const fileInput = document.getElementById("file-input");
    const fileList = document.getElementById("file-list");
    const processButton = document.getElementById("process-button");
    const loadingIndicator = document.getElementById("loading-indicator");
    const downloadAllButton = document.getElementById("download-all-button");

    let filesArray = [];

    dropArea.addEventListener("dragover", (event) => {
        event.preventDefault();
    });

    dropArea.addEventListener("dragleave", () => {
    });

    dropArea.addEventListener("drop", async (event) => {
        event.preventDefault();
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
        processButton.style.display = "none";
        document.getElementById("file-label").style.display = "none";
        loadingIndicator.style.display = "block";
        logContainer.style.display = "block";

        let processedFiles = [];

        for (let i = 0; i < filesArray.length; i++) {
            const file = filesArray[i];
            const listItem = fileList.children[i];
            const progress = listItem.querySelector(".progress-bar span");

            try {
                const fileName = file.name;
                const inputMp3 = fileName;
                const tempWav = `temp.wav`;
                const cleanedWav = `cleaned.wav`;
                const outputMp3 = fileName.replace(".mp3", "_cleaned.mp3");

                const fileData = new Uint8Array(await file.arrayBuffer());
                ffmpeg.writeFile(inputMp3, fileData);

                progress.style.width = "25%";
                await ffmpeg.exec(["-i", inputMp3, "-acodec", "pcm_s16le", "-ar", "8000", "-ac", "1", tempWav]);

                progress.style.width = "50%";
                await ffmpeg.exec(["-i", tempWav, "-af", "volume=2.0, silenceremove=start_periods=1:start_threshold=-40dB:start_silence=1.5:stop_threshold=-40dB:stop_silence=2:stop_periods=-1", cleanedWav]);

                progress.style.width = "75%";
                await ffmpeg.exec(["-i", cleanedWav, "-codec:a", "libmp3lame", "-b:a", "64k", "-ar", "8000", "-ac", "1", outputMp3]);

                progress.style.width = "100%";

                const processedData = ffmpeg.readFile(outputMp3);
                const audioBlob = new Blob([processedData.buffer], { type: "audio/mpeg" });

                listItem.innerHTML = "";
                const cleanedFileName = document.createElement("span");
                cleanedFileName.textContent = outputMp3;

                const downloadLink = document.createElement("a");
                downloadLink.href = URL.createObjectURL(audioBlob);
                downloadLink.download = outputMp3;
                downloadLink.textContent = "Download";
                downloadLink.classList.add("button");

                listItem.appendChild(cleanedFileName);
                listItem.appendChild(downloadLink);

                processedFiles.push({ name: outputMp3, blob: audioBlob });
            } catch (error) {
                console.error("[YB ERR] Error while processing file:", error);
            }
        }

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
    });
});
