import { createWs } from './createWs'
import {catchError, tap} from "rxjs/operators";

const serializerHandler = (event) => {
  // If there is a emit key on object, webserver expects to stringify content
  if (!!event.emit) {
    return JSON.stringify(event)
  } else {
    return event
  }
}

const openWebSocketConnection = (webSocketConfig, reconnectionCallback) => {
  let config = {}
  if (typeof webSocketConfig === 'string') {
    config = {
      url: webSocketConfig,
      serializer: serializerHandler,
      binaryType: 'arraybuffer'
    }
  }

  if (typeof webSocketConfig === 'object') {
    config = {
      serializer: serializerHandler,
      binaryType: 'arraybuffer',
      ...webSocketConfig
    }
  }

  const connection = createWs(config)

  connection.pipe(
    catchError(error => {
      tap(val => console.log(`[Perse Ws] Error reasons`, error))
    })
  ).subscribe({
    error: () => {
      console.log('[Perse Ws] Reconnected to server')
      reconnectionCallback(openWebSocketConnection(webSocketConfig, reconnectionCallback))
    }
  })

  connection.close = () => connection.complete()

  //Close connection and return new instance of WebSocket
  connection.restart = function () {
    connection.close()
    return openWebSocketConnection(webSocketConfig, reconnectionCallback)
  }

  return connection
}
export { openWebSocketConnection }
