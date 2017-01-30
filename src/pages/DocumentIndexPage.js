import React, { Component } from 'react'
import { Link } from 'react-router'
import {} from './DocumentIndexPage.css';
import Document from '../models/Document';
import { MdDelete } from 'react-icons/lib/md';
import { without } from 'lodash';

export default class DocumentIndexPage extends Component {
  state = {
    documents: [],
    isLoading: true,
  }

  componentDidMount() {
    this.setState({ isLoading: true })
    Document.query().then((response) => {
      this.setState({ documents: response.data.documents, isLoading: false })
    })
  }

  deleteDocument(e, doc) {
    e.preventDefault();
    Document.delete(doc.id).then(() => {
      this.setState({ documents: without(this.state.documents, doc) })
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
            <Link className='button primary' to='/'>New</Link>
          </div>
        </header>
        <div className="container">
          {this.state.isLoading ? (
            <div>Loading...</div>
          ) : this.state.documents.map((doc) => {
              return (
                <Link to={`/documents/${doc.id}`} className="document-row" key={doc.id}>
                  {doc.title}
                  <button
                    className="button danger"
                    onClick={(e) => this.deleteDocument(e, doc)}
                  >
                    <MdDelete />
                  </button>
                </Link>
              )
            })
          }
        </div>
      </div>
    );
  }
}
