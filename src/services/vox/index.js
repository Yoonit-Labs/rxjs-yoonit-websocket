import { promiseMaker, requesterVox } from '../../utils'

const vox = {
  /**
   * @method authentication
   * @description Append file to FormData object and send it to Perse API
   * @param {string} clientId
   * @param {string} clientSecret
   * @returns {Promise<(data|undefined)[]|(undefined|error)[]>}
   */
  authentication: async () => {
    return promiseMaker(
      requesterVox({
        method: 'GET',
        headers: {},
        url: '/oauth/token'
      })
    )
  }
}

export default vox
