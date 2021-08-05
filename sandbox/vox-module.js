console.log('[Vox Module Loaded]')

let recorder, audio;

let audioInput = document.getElementById('audio')
let inputTTS = document.getElementById('input-tts')

let sttResult = document.getElementById('stt-result')
let ttsResult = document.getElementById('tts-result')


// hooks

window
  .addEventListener('load', onLoaded);

document
  .getElementById('start')
  .addEventListener('click', () => startRec());

document
  .getElementById('stop')
  .addEventListener('click', () => stopRec());

document
  .getElementById('tts')
  .addEventListener('click', () => tts());

document
  .getElementById('restart')
  .addEventListener('click', () => restart())

audioInput.addEventListener("change", (evt) => {
  const file = evt.path[0].files[0];
  if (window.FileReader) {
    const reader = new FileReader();
    reader.onloadend = (e) => PerseWS.Store.set('vox/upload', e.target.result);
    reader.readAsArrayBuffer(file);
  }
})


// methods

async function onLoaded() {
  // recorder = await PerseWS.YooRecorder() // initialize recorder
  //
  await PerseWS.Store.set('vox/authenticate', reconnectionCallback); // start authentication

  // update results to debug
  PerseWS.Store.get('vox/ws').subscribe((e) => {
    if (e.event === 'stt') {
      sttResult.innerHTML = e.payload.text
    } else if (e.event === 'tts') {
      ttsResult.style.display = 'block';
      ttsResult.src = `https://api.cybervox.ai${e.payload.audio_url}`;
    }
  })
}

async function restart () {
  await PerseWS.Store.set('vox/restart')

  PerseWS.Store.get('vox/ws').subscribe((e) => {
    if (e.event === 'stt') {
      sttResult.innerHTML = e.payload.text
    } else if (e.event === 'tts') {
      ttsResult.style.display = 'block';
      ttsResult.src = `https://api.cybervox.ai${e.payload.audio_url}`;
    }
  })
}

async function startRec() {
  console.log('aqui')
  webSocketServer.next({
    emit: "tts",
    payload: {
      text: 'Hello my Old Friend'
    }
  })
}

async function reconnectionCallback (wsInstance) {
  await PerseWS.Store.set('vox/saveWebSocket', wsInstance)

  PerseWS.Store.get('vox/ws').subscribe((e) => {
    if (e.event === 'stt') {
      sttResult.innerHTML = e.payload.text
    } else if (e.event === 'tts') {
      ttsResult.style.display = 'block';
      ttsResult.src = `https://api.cybervox.ai${e.payload.audio_url}`;
    }
  })
}

async function stopRec() {
  stopUi(); // run ui changes for stop recording
  recorder.stop(); // stop recorder
  await resolveAudio(await recorder.getMedia()); // resolve audio
}

async function resolveAudio(media) {
  media.play(); // play audio (for debug only)
  recorder.clear(); // clear recorded audio from buffer
  PerseWS.Store.set('vox/upload', media.file) // upload file to stt
}

function tts() {
  ttsResult.style.display = 'none'; // hide audio player while sending new tts
  if (inputTTS.value) PerseWS.Store.set('vox/tts', inputTTS.value); // send text to tts
}


// UI CHANGE METHODS

function startUi() {
  sttResult.innerHTML = ''
  document.getElementById('recording').style.display = 'block';
  document.getElementById('start').disabled = true;
  document.getElementById('stop').removeAttribute('disabled');
}

function stopUi() {
  document.getElementById('recording').style.display = 'none';
  document.getElementById('stop').disabled = true;
  document.getElementById('start').removeAttribute('disabled');
}
