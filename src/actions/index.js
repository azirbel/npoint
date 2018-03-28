// @format

export const LOG_IN = 'LOG_IN'
export const LOG_OUT = 'LOG_OUT'
export const CACHE_THIN_DOCUMENTS = 'CACHE_THIN_DOCUMENTS'

export function logIn(user) {
  return {
    type: LOG_IN,
    user,
  }
}

export function logOut() {
  return {
    type: LOG_OUT,
  }
}

export function cacheThinDocuments(documents) {
  return {
    type: CACHE_THIN_DOCUMENTS,
    documents,
  }
}
