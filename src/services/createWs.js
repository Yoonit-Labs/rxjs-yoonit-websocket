import { webSocket } from "rxjs/webSocket";

/**
 * Create a rxjs websocket
 * @returns {Observable}
 */
const createWs = (websocketConfig) => {
  const subject = webSocket(websocketConfig);

  /**
   * Creating a send event to emulate ws default pattern
   * @param action
   */
  subject.send = (action) => subject.next(action)

  return subject
}

export { createWs }
