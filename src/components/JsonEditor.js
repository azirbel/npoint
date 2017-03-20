import React, { Component, PropTypes } from 'react';
import AceEditor from 'react-ace';
import {} from './JsonEditor.css';

export default class JsonEditor extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    readOnly: PropTypes.bool,
    rows: PropTypes.number,
  }

  render() {
    return (
      <div className="json-editor">
        <AceEditor
          className='json-ace-editor'
          value={this.props.value}
          onChange={(newValue) => this.props.onChange(newValue)}
          editorProps={{$blockScrolling: true}}
          mode='javascript'
          width='100%'
          showPrintMargin={false}
          tabSize={2}
          maxLines={this.props.rows}
          readOnly={this.props.readOnly}
        />
      </div>
    );
  }
}
