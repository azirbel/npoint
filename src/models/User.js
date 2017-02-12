/* global axios */

const BASE_URL = '/users';

export default {
  get: (id) => axios.get(`${BASE_URL}/${id}`),
  create: (params) => axios.post(BASE_URL, params),
}
