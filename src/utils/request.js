import axios from 'axios'
import { API } from '../services/endpoints'

/**
 * @method requester
 * @param method
 * @param headers
 * @param url
 * @param data
 * @description Create axios instance with api url according to env and executes requests
 * @returns {axiosInstance}
 */
export const requester = ({ method, headers, url, data }) => {
  const axiosInstance = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? API.PROD : API.DEV
  })

  return axiosInstance({
    method,
    url,
    headers,
    data
  })
}
/**
 * @method requester vox
 * @param method
 * @param headers
 * @param url
 * @param data
 * @description Create axios instance with api url according to env and executes requests
 * @returns {axiosInstance}
 */
export const requesterVox = ({ method, headers, url, data }) => {
  const axiosInstance = axios.create({
    baseURL: process.env.NODE_ENV === 'production' ? API.VOX_PROD : API.VOX_DEV
  })

  return axiosInstance({
    method,
    url,
    headers,
    data
  })
}
/**
 * @method promiseMaker
 * @description Returns an array with request data or error
 * @param promise
 * @returns {Promise<[data, undefined]>|[undefined, error]}
 */
export const promiseMaker = promise => {
  if (!promise) {
    return
  }

  try {
    return promise
      .then(
        data =>
          (
            [data, undefined]
          )
      )
      .catch(
        error =>
          Promise.resolve(
            [undefined, error]
          )
      )
  } catch (error) {
    return Promise.resolve(
      [undefined, error]
    )
  }
}
