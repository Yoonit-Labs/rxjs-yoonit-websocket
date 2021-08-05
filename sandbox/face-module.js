console.log('[Bundle Loaded] ', Perse.Cache.db)

/**
 * STORE MODULE USAGE:
 *
 * STATE:
 * $Perse.Store.state.Module.property
 * $Perse.Store.state['Module'].property
 * $Perse.Store.state['Module']['property']
 *
 * GET:
 * $Perse.Store.get('auth/getUser')
 *
 * MIX:
 * $Perse.Store.mix('auth/mixUser')
 *
 * SET:
 * $Perse.Store.set('module/method', payload)
 * $Perse.Store.dispatch({ type: 'module/method', payload: 'payload' })
 */

// COUNT MODULE
// document.getElementById('increment').addEventListener('click', async () => {
//     await $Perse.Store.set('count/increment')
//     console.log('[get: count/getCount] ', $Perse.Store.get('count/getCount'))
// })
// document.getElementById('decrement').addEventListener('click', async () => {
//     await $Perse.Store.set('count/decrement')
//     console.log('[get: count/getCount] ', $Perse.Store.get('count/getCount'))
// })

document.getElementById('faceDetection').addEventListener('click', async () => {
  const file = document.getElementById('faceDetectionImage').files[0]
  Perse.init('8hJ2e4hq0S8Z8VDcj0ycY1a4awAt62vQ2XvFO1LP')

  const result = await Perse.face.detect(file)
  const imageValidation = await Perse.face.quality(file)

  console.log(result)
  console.log(imageValidation)
})

document.getElementById('faceCompare').addEventListener('click', async () => {
  const firstFile = document.getElementById('compareImageFirst').files[0]
  const secondFile = document.getElementById('compareImageSecond').files[0]

  Perse.init('IdOXGMUfxIau9OBsp0zko5VrcVyq1dv86V1RxScv')
  const authentication = await Perse.face.isSimilar(firstFile, secondFile)
  const compare = await Perse.face.compare(firstFile, secondFile)

  console.log(authentication)
  console.log(compare)
})

// MAIN MODU
////
// Debug store observe
// - On store change this event listener will trigger
////
// $Perse.Store.observe(async (state) => {
//     console.log('[observe] ', state)
//
//     moduleCount.textContent = JSON.stringify(await $Perse.Store.get('count/getCount'), null, 2);
// })
