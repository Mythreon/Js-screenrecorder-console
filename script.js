// Mythreon 2025

navigator.mediaDevices.getDisplayMedia({ video: true })
  .then(function(stream) {
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorder.ondataavailable = function(event) {
      let videoBlob = event.data;
      let videoURL = URL.createObjectURL(videoBlob);
      let a = document.createElement('a');
      a.href = videoURL;
      a.download = 'recording.webm';
      a.click();
    };
    mediaRecorder.start();
    setTimeout(() => mediaRecorder.stop(), 600000);  // stops after 10 minutes automatically. You can increase/decrease this to your liking.
  })
  .catch(function(error) {
    console.error('Error capturing screen:', error);
  });

