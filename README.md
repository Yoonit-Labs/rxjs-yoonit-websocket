# yoo-websocket

## How to run the project
``
npm install @cyberlabsai/yoonit-websocket
npm run serve
``

## How to build locally and use it on another project

After installing the project:

1- At the root of Yoonit websocket directory, run: `npm link`

2- In the project that you want to use Yoonit websocket, run: `npm link @cyberlabsai/yoonit-websocket`

3- Then, run `npm run watch` on Yoonit Websocket directory

## How to use it

- Just need to import the lib and pass config values to it.
  
- Yoonit Websocket is implemented using RxJs Websockets, so options passed on RxJs is accepted by Yoonit Websocket, as
  serializer and binaryType.

- It's important to define a reconnection callback in cases that connection is ended unexpectedly. The callback receives
a new websocket instance. It's necessary to [subscribe] response handler again. Read more on Getting Ws Response to
understand more about getting ws response.

```
Import YoonitWs from @cyberlabsai/yoo-websocket

YoonitWs.openWebSocketConnection({ url: process.env.WS_URL, serializer: (e) => return e, binaryType: 'arraybuffer' }, reconnectionCallback)

```

- If you don't need custom setup, just pass url to the method

```
Import YoonitWs from @cyberlabsai/yoo-websocket

YoonitWs.openWebSocketConnection(process.env.WS_URL, reconnectionCallback)
```

## Getting Ws Response

- To get websocket response, is necessary to subscribe a function to be the handler.

Ie: `YoonitWsInstance.subscribe(responseHandler)`


## Restarting Websocket

- In order to restart Websocket connect, you only need to call .restart(). Restart method returns a new websocket instance,
it's necessary to subscribe response handler on this new instance.

- The reconnection callback passed as parameter, will be called when connection is terminated abruptly.
