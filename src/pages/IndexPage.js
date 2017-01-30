import React, { Component } from 'react'
import JsonEditor from '../components/JsonEditor';
import Document from '../models/Document';

export default class IndexPage extends Component {
  state = {
    newDocumentContents: JSON.stringify({
      what: 'a simple JSON data store',
      why: [
        'quick setup',
        'easy editing',
        '(coming soon) validation',
      ]
    }, null, 2)
  }

  createNewDocument() {
    Document.create({
      title: 'Untitled',
      contents: this.state.newDocumentContents,
    }).then((response) => {
      this.props.router.push(`/documents/${response.data.document.id}`)
    })
  }

  render() {
    return (
      <div>
        <header>
          <div className="container header-container">
            <h1>
              <span className="logo-first-letter">n</span>
              point
            </h1>
          </div>
        </header>
        <div className="container">
          <h1 className="text-center">
            Simple, reliable JSON storage
          </h1>
          <JsonEditor
            value={this.state.newDocumentContents}
            onChange={e => this.setState({ newDocumentContents: e.target.value })}
          />
          <div className="flex-center-content">
            <button
              className="button primary large"
              onClick={() => this.createNewDocument()}
            >
              Save
            </button>
          </div>
        </div>
      </div>
    );
  }
}
