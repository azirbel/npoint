/* global axios */

export default {
  login: (params) => axios.post('/login', params),
  logout: () => axios.delete('/logout'),
}
