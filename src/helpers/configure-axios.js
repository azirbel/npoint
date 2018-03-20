// @format

/* global axios */

import _ from 'lodash'

export default function () {
  axios.defaults.headers.common['Content-Type'] = 'application/json'
  axios.defaults.headers.common['X-CSRF-Token'] = (
    document.head.querySelector('meta[name=csrf-token]') || {}
  ).content

  // Rails gets snake_case, JS gets camelCase
  axios.defaults.transformResponse = [].concat(
    axios.defaults.transformResponse,
    (data) => {
      if (_.isArray(data)) {
        return _.map(data, (d) => _.mapKeys(d, (value, key) => _.camelCase(key)))
      } else {
        return _.mapKeys(data, (value, key) => _.camelCase(key))
      }
    },
  )

  axios.defaults.transformRequest = [].concat(
    (data, headers) => {
      return _.mapKeys(data, (value, key) => _.snakeCase(key))
    },
    axios.defaults.transformRequest,
  )

  axios.interceptors.response.use(response => {
    let newToken = response.headers['x-csrf-token']
    if (newToken) {
      axios.defaults.headers.common['X-CSRF-Token'] = newToken
      let csrfMeta = document.querySelector('meta[name=csrf-token]')
      if (csrfMeta) {
        csrfMeta.setAttribute('content', newToken)
      }
    }
    return response
  })
}
