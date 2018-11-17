import { readableEvalError, readableParseError } from './readableJsonError'

// Following https://www.html5rocks.com/en/tutorials/security/sandboxed-iframes/

const IFRAME_EVENT_LISTENER = function(event) {
  let mainWindow = event.source
  let objStr = event.data
  let result = ''

  try {
    // NOTE: Use Function() rather than eval() to deny access to context
    // variables like `event` and `window`
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/eval
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function
    let data = Function('"use strict";return (' + event.data + ')')()
    result = { original: objStr, data: data }
  } catch (error) {
    result = { original: objStr, data: null, errorMessage: error.message }
  }

  mainWindow.postMessage(result, event.origin)
}

function naiveParseJson(jsonStr) {
  // Fallback to naive JSON parse - old browsers can still use this
  let json = null
  let errorMessage = null

  try {
    json = JSON.parse(jsonStr)
  } catch (e) {
    errorMessage = readableParseError(jsonStr, e)
  }

  return { json, errorMessage }
}

// Important to use via srcdoc, and not src: see
// https://stackoverflow.com/a/30507852. This means the sandboxing is still
// secure in legacy browsers.
export const IFRAME_SRC_DOC = `
  <!DOCTYPE html>
  <html>
   <head>
     <title>npoint eval iframe</title>
     <script>
       window.addEventListener('message', ${IFRAME_EVENT_LISTENER.toString()});
     </script>
   </head>
  </html>
`

// Uses the given iframe to parse a JS object string into a JS object.
// Example input:
// "{ a: 3 }"
//
// Example resolved output:
// { json: {a: 3}, errorMessage: null }
//
// Resolved json will be valid if `errorMessage` is null. Example:
// { json: null, errorMessage: null } // valid
// { json: null, errorMessage: 'Bad' } // invalid
export function evalParseObject(objStr, iframe) {
  return new Promise((resolve, reject) => {
    if (objStr === '') {
      resolve({ json: null, errorMessage: null })
    }

    if (!iframe) {
      resolve(naiveParseJson(objStr))
    }

    let handleIframeMessage = event => {
      if (event.data.original !== objStr) {
        return false // got a postMessage intended for someone else
      }

      // Again from https://www.html5rocks.com/en/tutorials/security/sandboxed-iframes:
      //
      // Sandboxed iframes which lack the 'allow-same-origin'
      // header have "null" rather than a valid origin. This means you still
      // have to be careful about accepting data via the messaging API you
      // create. Check that source, and validate those inputs!
      if (event.origin === 'null' && event.source === iframe.contentWindow) {
        resolve({
          json: event.data.data,
          errorMessage: readableEvalError(event.data.errorMessage),
        })
      } else {
        resolve(naiveParseJson(objStr))
      }
    }

    window.addEventListener('message', handleIframeMessage)
    iframe.contentWindow.postMessage(objStr, '*')
  })
}
