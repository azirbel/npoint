/* global axios */

const BASE_URL = "/users";

export default {
  me: () => axios.get(`${BASE_URL}/me`, { data: {} }),
  create: params => axios.post(BASE_URL, params)
};
