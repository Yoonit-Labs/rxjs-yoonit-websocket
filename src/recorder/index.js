const recordingStatus = {
  idle: 'idle',
  recording: 'recording',
  pause: 'pause',
  stop: 'stop'
}

const YooRecorder = async () => {
  let audioChunks = [];
  const stream = await navigator.mediaDevices.getUserMedia({audio: true, video: false});
  const mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.status = recordingStatus.idle;
        mediaRecorder.addEventListener("dataavailable", event => audioChunks.push(event.data));

  const start = () => {
    if (mediaRecorder.status !== recordingStatus.recording) {
      mediaRecorder.status = recordingStatus.recording;
      mediaRecorder.start();
    }
  }

  const pause = () => {
    mediaRecorder.status = recordingStatus.pause;
    mediaRecorder.stop();
  }

  const stop = () => {
    mediaRecorder.status = recordingStatus.stop;
    pause();
    clear();
  };

  const clear = () => {
    audioChunks = [];
  }

  const getMedia = async () => {
    return new Promise(resolve => {
      mediaRecorder.addEventListener("stop", () => {
        const audioType = { type : 'audio/wav' };
        const audioBlob = new Blob(audioChunks, audioType);
        const audioUrl = URL.createObjectURL(audioBlob);
        const audio = new Audio(audioUrl);
        const play = () => audio.play();
        const file = new File(
          [audioBlob],
          Date.now()+".wav",
          audioType
        );
        resolve({ audio, audioBlob, audioUrl, file, play });
      });
    })
  }

  return({ mediaRecorder, start, pause, stop, clear, getMedia });
}

export default YooRecorder
