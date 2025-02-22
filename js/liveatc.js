document.addEventListener("DOMContentLoaded", async () => {
    if (!window.FFmpeg || !window.FFmpeg.createFFmpeg) {
        console.error("FFmpeg 라이브러리가 로드되지 않았습니다.");
        return;
    }

    const { createFFmpeg } = window.FFmpeg;
    const ffmpeg = createFFmpeg({
        log: true,
        wasmPath: '/assets/ffmpeg/ffmpeg-core.js'  // FFmpeg 0.10.0 버전에서는 corePath 대신 wasmPath 사용
    });

    console.log("FFmpeg 인스턴스 생성 완료:", ffmpeg);
    await ffmpeg.load();
    console.log("FFmpeg 로드 완료!");
});