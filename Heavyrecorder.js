// What's the difference between the two recorders?
// In script.js (the standard one), you have to manually transport the video to MOV or MP4.
// In this one, it is done automatically, but it is CPU usage heavy.

// This one also has more features, and is better than the regular recorder.

                      ///   READ BELOW    ///
///////////////////////////////////////////////////////////////////
// SAVE THIS AS screen_recorder.html                             //
// Open in chrome (not sure if it works anywhere else)           //
// Click "start recording", share your screen.                   //
// Click "stop recording", when you want to stop recording       //
// Wait for the file to download                                 //
///////////////////////////////////////////////////////////////////


<!DOCTYPE html>
<html>
<head>
  <title>Screen Recorder</title>
  <script src="https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.4/dist/ffmpeg.min.js"></script>
</head>
<body>
  <button id="startBtn">Start Recording</button>
  <button id="stopBtn" disabled>Stop Recording</button>
  <p id="status"></p>

  <script>
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const status = document.getElementById('status');

    let mediaRecorder;
    let chunks = [];
    let stream;

    startBtn.onclick = async () => {
      startBtn.disabled = true;
      stopBtn.disabled = false;
      status.textContent = 'Recording...';

      try {
        stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });

        let options = { mimeType: 'video/webm;codecs=vp9,opus' };
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          options = { mimeType: 'video/webm;codecs=vp8,opus' };
        }
        if (!MediaRecorder.isTypeSupported(options.mimeType)) {
          options = { mimeType: 'video/webm' };
        }

        mediaRecorder = new MediaRecorder(stream, options);

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) chunks.push(e.data);
        };

        mediaRecorder.onstop = async () => {
          stopBtn.disabled = true;
          startBtn.disabled = false;
          status.textContent = 'Converting to .mov...';

          const webmBlob = new Blob(chunks, { type: 'video/webm' });
          const { createFFmpeg, fetchFile } = FFmpeg;
          const ffmpeg = createFFmpeg({ log: true });
          await ffmpeg.load();

          ffmpeg.FS('writeFile', 'input.webm', await fetchFile(webmBlob));
          await ffmpeg.run('-i', 'input.webm', '-c:v', 'copy', '-c:a', 'aac', 'output.mov');
          const movData = ffmpeg.FS('readFile', 'output.mov');

          const movBlob = new Blob([movData.buffer], { type: 'video/quicktime' });
          const movUrl = URL.createObjectURL(movBlob);

          const a = document.createElement('a');
          a.href = movUrl;
          a.download = 'recording.mov';
          a.click();

          status.textContent = 'Recording downloaded as .mov';
          chunks = [];
          stream.getTracks().forEach(t => t.stop());
        };

        mediaRecorder.start();
      } catch (err) {
        console.error('Error:', err);
        status.textContent = 'Failed to start recording.';
        startBtn.disabled = false;
        stopBtn.disabled = true;
      }
    };

    stopBtn.onclick = () => {
      if (mediaRecorder && mediaRecorder.state === 'recording') {
        mediaRecorder.stop();
        status.textContent = 'Stopping...';
      }
    };
  </script>
</body>
</html>


