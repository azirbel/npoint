// @format

/* global axios */

const BASE_URL = '/schema'

export default {
  validate: params => axios.post(`${BASE_URL}/validate`, params),
  generate: params => axios.post(`${BASE_URL}/generate`, params),
}
