/* global axios */

export default {
  login: params =>
    axios.post("/users/sign_in", {
      user: params
    }),
  logout: () =>
    axios.delete("/users/sign_out", {
      data: {} // TODO(azirbel): Workaround for axios bug https://github.com/mzabriskie/axios/issues/362
    })
};
