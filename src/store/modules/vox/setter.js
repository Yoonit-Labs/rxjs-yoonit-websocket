import { Store } from '../../index'
import { openWebSocketConnection } from "../../config/webSocket";
import { vox } from '../../../services'

const set = {
  'vox/authenticate': async (reconnectionCallback) => {
    const [
      response,
      error
    ] = await vox.authentication()

    if (error) {
      console.error('[vox/authenticate error] ', error)
      return error
    } else {
      await Store.mix('vox/mixJwt', response.data)
      Store.set('vox/openWs', reconnectionCallback)
      return response
    }
  },
  'vox/openWs': async (reconnectionCallback) => {
    const jwtToken = await Store.get('vox/jwt')
    const VoxWS = openWebSocketConnection(
      { url: `wss://api.cybervox.ai/ws?access_token=${jwtToken.access_token}` },
      reconnectionCallback
    )

    await Store.set('vox/saveWebSocket', VoxWS)
  },
  'vox/subscribe': async () => {
    const VoxWS = await Store.get('vox/ws');
    VoxWS.subscribe(async (e) => {
      if (e.event === 'stt') {
        await Store.mix('vox/mixSTT', e)
      } else if (e.event === 'tts') {
        await Store.mix('vox/mixTTS', 'https://api.cybervox.ai' + e.payload.audio_url)
      } else if (e.event === 'upload') {
        Store.set('vox/stt', e.payload.upload_id)
      }
    });
  },
  'vox/closeWs': async () => {
    const VoxWS = await Store.get('vox/ws');
    VoxWS.complete()
  },
  'vox/upload': async (file) => {
    const VoxWS = await Store.get('vox/ws');
    await VoxWS.next({
      emit: "upload",
      payload: {
        max_uploads: 1,
        timestamp: Date.now()
      }
    })
    await VoxWS.next(file)
  },
  'vox/stt': async (uploadId) => {
    const VoxWs = await Store.get('vox/ws');
    await VoxWs.next({
      emit:"stt",
      payload: {
        upload_id: uploadId,
        timestamp: Date.now()
      }
    })
  },
  'vox/tts': async (text) => {
    const VoxWs = await Store.get('vox/ws');
    VoxWs.next({
      emit: "tts",
      payload: {
        text: text,
        timestamp: Date.now()
      }
    })
  },
  'vox/saveWebSocket': async (webSocketConnection) => {
    await Store.mix('vox/mixWs', webSocketConnection);
    Store.set('vox/subscribe')
  },
  'vox/restart': async () => {
    const VoxWs = await Store.get('vox/ws')
    const newVoxConnection = VoxWs.restart()
    await Store.mix('vox/mixWs', newVoxConnection);
    Store.set('vox/subscribe')
  }
}

export default set
