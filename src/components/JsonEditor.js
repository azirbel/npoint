// @format

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {} from 'brace'
import AceEditor from 'react-ace'
import { IFRAME_SRC_DOC, evalParseObject } from '../helpers/sandboxedEval'
import {} from './JsonEditor.css'

import 'brace/mode/javascript'
import 'brace/snippets/javascript'
import 'brace/ext/language_tools'
import '../helpers/npoint-ace-theme'

export default class JsonEditor extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool,
    rows: PropTypes.number,
  }

  sandboxedIframe = null

  handleChange = async (newValue) => {
    // TODO(azirbel): Debounce the parse and fire more onChange?
    let { json, errorMessage } = await evalParseObject(
      newValue,
      this.sandboxedIframe
    )

    this.props.onChange(newValue, json, errorMessage)
  }

  render() {
    return (
      <div className="json-editor">
        <iframe
          className="hidden-iframe"
          sandbox="allow-scripts"
          srcDoc={IFRAME_SRC_DOC}
          ref={el => (this.sandboxedIframe = el)}
        />
        <AceEditor
          mode="javascript"
          theme="npoint"
          className="json-ace-editor"
          value={this.props.value}
          onChange={this.handleChange}
          editorProps={{ $blockScrolling: true }}
          width="100%"
          showPrintMargin={false}
          tabSize={2}
          fontSize={14}
          maxLines={Infinity}
          readOnly={this.props.readOnly}
          annotations={[]}
          markers={[]}
          setOptions={{ useWorker: false, wrap: true }}
        />
      </div>
    )
  }
}
