import _ from 'lodash'

import Document from '../models/Document'

export default function(router, contents) {
  let params = _.isEmpty(contents) ? { generateContents: true } : { contents }

  Document.create(_.merge(params)).then(response => {
    router.push(`/docs/${response.data.token}`)
  })
}
