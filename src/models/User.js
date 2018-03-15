/* global axios */

const BASE_URL = '/users';

export default {
  me: () => axios.get(`${BASE_URL}/me`, { data: {} }),
  create: (params) => axios.post(BASE_URL, params),
  update: (params) => axios.patch(`${BASE_URL}/me`, params),
  sendResetPasswordEmail: () => axios.post(`${BASE_URL}/send_reset_password_email`),
}
