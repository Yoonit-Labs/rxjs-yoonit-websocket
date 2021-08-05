console.log('[Bundle Loaded] ', Perse.Cache.db)

// Cache Module Methods
document.getElementById('zeroCountCache').addEventListener('click', async () => {
    await Perse.Cache.setCache({ _id: 'Count' }, { count: 0 })
    updateExampleCode()
})
document.getElementById('tenCountCache').addEventListener('click', async () => {
    await Perse.Cache.setCache({ _id: 'Count' }, { count: 10 })
    updateExampleCode()
})
document.getElementById('removeCache').addEventListener('click', () => {
    Perse.Cache.removeCache({ _id: 'Count' })
    updateExampleCode()
})

// State Module Methods
document.getElementById('increment').addEventListener('click', async () => {
    await Perse.Store.set('count/increment')
    console.log('[get: count/getCount] ', Perse.Store.get('count/getCount'))
})
document.getElementById('decrement').addEventListener('click', async () => {
    await Perse.Store.set('count/decrement')
    console.log('[get: count/getCount] ', Perse.Store.get('count/getCount'))
})

////
// Debug Store Module Observe
// - On a Store change this event listener will trigger and update the example code
////
Perse.Store.observe(async (state) => {
    console.log('[observe] ', state)
    updateExampleCode()
})

// helper functions to update example code blocks
async function updateExampleCode () {
    updateStateCount()
    updateCacheObject()
}
async function updateStateCount () {
    moduleCount.textContent = JSON.stringify(await Perse.Store.get('count/getCount'), null, 2);
}
async function updateCacheObject() {
    const getAllCache = await Perse.Cache.find({})
    moduleCache.textContent = JSON.stringify(getAllCache, null, 2);
}
