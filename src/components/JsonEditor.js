// @format

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {} from 'brace'
import AceEditor from 'react-ace'
import _ from 'lodash'

import 'brace/mode/javascript'
import 'brace/snippets/javascript'
import 'brace/ext/language_tools'
import '../helpers/npointAceTheme'

import {} from './JsonEditor.css'

export default class JsonEditor extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onEnter: PropTypes.func,
    onSave: PropTypes.func,
    readOnly: PropTypes.bool,
    rows: PropTypes.number,
  }

  handleChange = (newValue, e) => {
    this.props.onChange(newValue)

    if (
      e.action === 'insert' &&
      _.isEqual(e.lines, ['', '']) &&
      this.props.onEnter
    ) {
      this.props.onEnter()
    }
  }

  commands = [
    {
      name: 'save',
      bindKey: {
        win: 'Ctrl-S',
        mac: 'Command-S',
      },
      exec: (env, args, request) => {
        if (this.props.onSave) {
          this.props.onSave()
        }
      },
    },
  ]

  render() {
    return (
      <div className="json-editor">
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
          commands={this.commands}
        />
      </div>
    )
  }
}
