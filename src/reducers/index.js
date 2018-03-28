// @format

import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import { CACHE_THIN_DOCUMENTS, LOG_IN, LOG_OUT } from '../actions'

function session(
  state = {
    loaded: false,
    loggedIn: false,
    user: null,
  },
  action
) {
  switch (action.type) {
    case LOG_IN:
      return {
        loaded: true,
        loggedIn: true,
        user: action.user,
      }
    case LOG_OUT:
      return {
        loaded: true,
        loggedIn: false,
        user: null,
      }
    default:
      return state
  }
}

function thinDocumentsCache(
  state = [],
  action
) {
  switch (action.type) {
    case CACHE_THIN_DOCUMENTS:
      return action.documents
    default:
      return state
  }
}

let rootReducer = combineReducers({
  routing,
  session,
  thinDocumentsCache,
})

export default rootReducer
