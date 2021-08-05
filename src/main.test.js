import * as PerseWS from './main'

describe('Testing WS connection', () => {
  it('Should open connection with server and return object',  () => {
    const connection = PerseWS.openWebSocketConnection(process.env.TEST_SOCKET_URL)

    const connectionKeys = Object.keys(connection)

    const areKeysIncluded = connectionKeys.includes('close') && connectionKeys.includes('restart')

    expect(areKeysIncluded).toBeTruthy()

    connection.close()
  })

  it('Should open connection with server by using config object',  () => {
    const connection = PerseWS.openWebSocketConnection({ url: process.env.TEST_SOCKET_URL })

    const connectionKeys = Object.keys(connection)

    const areKeysIncluded = connectionKeys.includes('close') && connectionKeys.includes('restart')

    expect(areKeysIncluded).toBeTruthy()

    connection.close()
  })

  it('Should close WS connection',  () => {
    let hasClosed = false
    try {
      const connection = PerseWS.openWebSocketConnection({ url: process.env.TEST_SOCKET_URL })
      connection.close()

      hasClosed = true
    } catch (e) {
      hasClosed = false
    }

    expect(hasClosed).toBeTruthy()
  })

  it('Should restart WS connection', () => {
    const connection = PerseWS.openWebSocketConnection({ url: process.env.TEST_SOCKET_URL })

    const newConnection = connection.restart()

    const connectionKeys = Object.keys(newConnection)

    const areKeysIncluded = connectionKeys.includes('close') && connectionKeys.includes('restart')

    expect(areKeysIncluded).toBeTruthy()

    newConnection.close()
  })

  it('Should create connection with complete config params', () => {
    const connection = PerseWS.openWebSocketConnection({
      url: process.env.TEST_SOCKET_URL,
      serializer: (e) => e,
      binaryType: 'arraybuffer'
    })

    const connectionKeys = Object.keys(connection)

    const areKeysIncluded = connectionKeys.includes('close') && connectionKeys.includes('restart')

    expect(areKeysIncluded).toBeTruthy()

    connection.close()
  })
})
