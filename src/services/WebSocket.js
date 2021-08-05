import { createWs } from './createWs'
import { catchError, tap } from "rxjs/operators";
import { Observable } from "rxjs";

/**
 * @function serializerHandler
 * @description Default handler to parse .next() payloads before sending to server
 * @param event {Object} next() function payload
 * @returns {string|*}
 */
const serializerHandler = (event) => {
  // If there is a emit key on object, webserver expects to stringify content
  if (!!event.emit) {
    return JSON.stringify(event)
  } else {
    return event
  }
}

/**
 * @function openWebSocketConnection
 * @description Open WebSocket connection based on params
 * @param webSocketConfig {string|object}
 * @param reconnectionCallback {Function} It will receive new connection instance when called
 * @returns {Observable} Websocket Connection
 */
const openWebSocketConnection = (webSocketConfig, reconnectionCallback = () => ({})) => {
  let config = {
    serializer: serializerHandler,
    binaryType: 'arraybuffer'
  }
  if (typeof webSocketConfig === 'string') {
    config.url = webSocketConfig
  }

  if (typeof webSocketConfig === 'object') {
    config = Object.assign(config, webSocketConfig)
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

  /**
   * @description Close connection and return new instance of WebSocket
   * @returns {Observable}
   */
  connection.restart = function () {
    connection.close()
    return openWebSocketConnection(webSocketConfig, reconnectionCallback)
  }

  return connection
}
export { openWebSocketConnection }
