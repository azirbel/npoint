// @format

/* global axios */

import _ from 'lodash'

// Rails gets snake_case, JS gets camelCase
export default function (params) {
  debugger;
  return _.mapKeys(params, (value, key) => _.snakeCase(key))
}
