import React, { Component } from 'react'
import { Link } from 'react-router'
import {} from './DocumentIndexPage.css';
import Document from '../models/Document';

export default class DocumentIndexPage extends Component {
  state = {
    documents: [],
    isLoading: true,
    newDocumentTitle: '',
    newDocumentContents: '',
  }

  componentDidMount() {
    this.loadDocuments()
  }

  render() {
    return (
      <div className="container">
        <h1>All Documents</h1>

        {this.state.isLoading ? (
          <div>Loading...</div>
        ) : (
          <ul>
            {this.state.documents.map((doc) => {
              return (
                <li key={doc.id}>
                  <Link to={`/edit/${doc.id}`}>{doc.title}</Link>
                  <button onClick={() => this.deleteDocument(doc)}>Delete</button>
                </li>
              )
            })}
          </ul>
        )}

        <div>
          <h2>Create new</h2>
          <label className='form-label'>
            Title
            <input
              type='text'
              value={this.state.newDocumentTitle}
              onChange={e => this.setState({ newDocumentTitle: e.target.value })}
              />
          </label>

          <label className='form-label'>
            JSON
            <input
              type='textarea'
              value={this.state.newDocumentContents}
              onChange={e => this.setState({ newDocumentContents: e.target.value })}
              />
          </label>

          <button onClick={() => this.createNewDocument()}>Create</button>
        </div>
      </div>
    );
  }

  loadDocuments() {
    this.setState({ isLoading: true })
    Document.query().then((response) => {
      this.setState({ documents: response.data.documents, isLoading: false })
    })
  }

  createNewDocument() {
    Document.create({
      title: this.state.newDocumentTitle,
      contents: this.state.newDocumentContents,
    }).then(() => {
      this.setState({ newDocumentTitle: '', newDocumentContents: '' })
      this.loadDocuments()
    })
  }

  deleteDocument(doc) {
    Document.delete(doc.id).then(() => this.loadDocuments())
  }
}
