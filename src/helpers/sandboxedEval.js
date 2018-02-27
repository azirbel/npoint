// Following https://www.html5rocks.com/en/tutorials/security/sandboxed-iframes/

// Important to use via srcdoc, and not src: see
// https://stackoverflow.com/a/30507852. This means the sandboxing is still
// secure in legacy browsers.
export const IFRAME_SRC_DOC = `
  <!DOCTYPE html>
  <html>
   <head>
     <title>Evalbox's Frame</title>
     <h1>Herro</h1>
     <script>
       window.addEventListener('message', function(e) {
         var mainWindow = e.source;
         var result = '';
         try {
           result = { data: eval(e.data) };
         } catch (e) {
           result = { data: null, errorMessage: e.message };
         }
         mainWindow.postMessage(result, event.origin);
       });
     </script>
   </head>
  </html>
`

// TODO(azirbel): Pull out the above JS into a function, then stringify it
// into IFRAME_HTML. Change "e" to "event".

// Uses the given iframe to parse a JS object string into a JS object.
// Example input:
// "{ a: 3 }"
//
// Example resolved output:
// {a: 3}
export function evalParseObject(objStr, iframe) {
  return new Promise((resolve, reject) => {
    if (!iframe) {
      resolve({ json: null, errorMessage: null });
    }

    let handleIframeMessage = (event) => {
      // Again from https://www.html5rocks.com/en/tutorials/security/sandboxed-iframes:
      //
      // Sandboxed iframes which lack the 'allow-same-origin'
      // header have "null" rather than a valid origin. This means you still
      // have to be careful about accepting data via the messaging API you
      // create. Check that source, and validate those inputs!
      if (event.origin === "null" && event.source === iframe.contentWindow) {
        resolve({ json: event.data.data, errorMessage: event.data.errorMessage });
      } else {
        resolve({ json: null, errorMessage: null });
      }
    }

    window.addEventListener('message', handleIframeMessage);
    iframe.contentWindow.postMessage(`(${objStr})`, '*');
  });
}
