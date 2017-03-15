import React, { Component, PropTypes } from 'react';
import AceEditor from 'react-ace';
import {} from './JsonEditor.css';

export default class JsonEditor extends Component {
  static propTypes = {
    value: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    rows: PropTypes.number,
  }

  render() {
    return (
      <div className="json-editor">
        <AceEditor
          mode="java"
          theme="github"
          value={this.props.value}
          onChange={(newValue) => this.props.onChange(newValue)}
          name="UNIQUE_ID_OF_DIV"
          editorProps={{$blockScrolling: true}}
        />
      </div>
    );
  }
}
