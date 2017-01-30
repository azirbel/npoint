import axios from 'axios'

const BASE_URL = '/documents';

export default {
  query: () => axios.get(BASE_URL),
  get: (id) => axios.get(`${BASE_URL}/${id}`),
  create: (params) => axios.post(BASE_URL, params),
  update: (id, params) => axios.patch(`${BASE_URL}/${id}`, params),
  delete: (id) => axios.delete(`${BASE_URL}/${id}`),
}
