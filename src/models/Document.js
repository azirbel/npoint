// @format

/* global axios */

const BASE_URL = '/documents'

export default {
  query: () => axios.get(BASE_URL, { data: {} }),
  get: token => axios.get(`${BASE_URL}/${token}`),
  create: params => axios.post(BASE_URL, params),
 update: (token, params) => axios.patch(`${BASE_URL}/${token}`, params),
  delete: token => axios.delete(`${BASE_URL}/${token}`),
}
