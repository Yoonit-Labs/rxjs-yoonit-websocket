const mix = {
  'vox/mixWs': (state, action) => {
    return {...state, Vox: { ...state.Vox, ws: action.payload }}
  },
  'vox/mixJwt': (state, action) => {
    return {...state, Vox: { ...state.Vox, jwt: action.payload }}
  },
}

export default mix
