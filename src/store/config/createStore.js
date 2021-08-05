import { Subject } from 'rxjs'
import { scan, startWith, shareReplay } from 'rxjs/operators'
import { modules } from '../modules'

const moduleKeys = Object.keys(modules)

let initialState, getterList, setterList, actionList = {}

// Populate setterList and initialState object according to modules
moduleKeys.forEach((i) => {
    initialState = { ...initialState, [i]: { ...modules[i].state } }
    getterList = { ...getterList, ...modules[i].get }
    setterList = { ...setterList, ...modules[i].mix }
    actionList = { ...actionList, ...modules[i].set }
})

/**
 * Create a rxjs redux-like store
 * @returns {Observable}
 */
const createStore = () => {
    const storeInstance = new Subject()

    /**
     * Create a reducer according to module action by type
     * @param state
     * @param action
     * @returns {*}
     */
    const reducer = (state = initialState, action) => {
        const DEFAULT_STATE = state => state
        const handler = setterList[action.type] || DEFAULT_STATE
        return handler(state, action)
    }

    /**
     * Creating a store instance with pipe rxjs methods
     * @type {Observable}
     */
    const store = storeInstance.pipe(
        startWith({type: '__INIT__'}),
        scan(reducer, undefined),
        shareReplay(1)
    )

    /**
     * Creating a dispatch event to emulate redux-like design pattern
     * @param action
     */
    store.dispatch = (action) => storeInstance.next(action)

    /**
     * Create a get event as alias shorthand for returning get functions from modules
     * @param action
     * @returns {*}
     */
    store.get = (action) =>
        getterList[action]
            ? getterList[action](store.state)
            : console.warn('[Perse SDK Store] The get method ', action, ' does not exist.')

    /**
     * Create a mix event as alias shorthand for next/dispatch
     * @param action
     * @param payload
     */
    store.mix = (action, payload) => {
        payload
            ? storeInstance.next({ type: action, payload })
            : storeInstance.next({ type: action })
    }

    /**
     * Create a set action event
     * @param action, payload
     * @returns {*}
     */
    store.set = (action, payload) =>
        actionList[action]
            ? actionList[action](payload)
            : console.warn('[Perse SDK Store] The set method ', action, ' does not exist.')

    /**
     * Create a subscription stream const to be reused
     * @param payload
     * @returns {*}
     */
    const subscription = async (payload) => await store.subscribe(payload)

    /**
     * Create a observe method to return our subscription changes
     * @type {function(*=): *}
     */
    store.observe = subscription

    /**
     * Update a local state object in store on subscription change
     */
    subscription((state) => store.state = state)

    return store
}

export { createStore }
