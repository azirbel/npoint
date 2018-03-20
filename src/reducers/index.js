// @format

import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import { LOG_IN, LOG_OUT } from '../actions'

function session(
  state = {
    loggedIn: false,
    user: null,
  },
  action
) {
  switch (action.type) {
    case LOG_IN:
      return {
        loggedIn: true,
        user: action.user,
      }
    case LOG_OUT:
      return {
        loggedIn: false,
        user: null,
      }
    default:
      return state
  }
}

let rootReducer = combineReducers({
  routing,
  session,
})

export default rootReducer
