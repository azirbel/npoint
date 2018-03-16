import React, { Component } from 'react'
import { isEmpty } from 'lodash'
import { Link } from 'react-router'
import {} from './DocumentIndexPage.css'
import Document from '../models/Document'
import Header from '../components/Header'
import { MdDelete } from 'react-icons/lib/md'
import { without } from 'lodash'

export default class DocumentIndexPage extends Component {
  state = {
    documents: [],
    isLoading: true,
    needsAuth: false,
  }

  componentDidMount() {
    this.setState({ isLoading: true })
    Document.query().then(
      response => {
        this.setState({ documents: response.data, isLoading: false })
      },
      error => {
        if (error.response && error.response.status === 401) {
          this.setState({ needsAuth: true, isLoading: false })
        }
      }
    )
  }

  deleteDocument(e, doc) {
    e.preventDefault()
    Document.delete(doc.token).then(() => {
      this.setState({ documents: without(this.state.documents, doc) })
    })
  }

  render() {
    return (
      <div>
        <Header>
          <h1 className="page-title">All Documents</h1>
          <div className="flex-spring" />
        </Header>
        <div className="container">
          {!this.state.isLoading &&
            isEmpty(this.state.documents) && (
              <div className="section text-center">
                <p>Looks like you don't have any documents yet.</p>
                <p>Try creating one with the "New" button in the header!</p>
              </div>
            )}
          {this.state.needsAuth && (
            <div>Please sign in to view your documents.</div>
          )}
          {this.state.documents.map(doc => {
            return (
              <Link
                to={`/docs/${doc.token}`}
                className="document-row"
                key={doc.token}
              >
                {doc.title}
                <button
                  className="button danger"
                  onClick={e => this.deleteDocument(e, doc)}
                >
                  <MdDelete />
                </button>
              </Link>
            )
          })}
        </div>
      </div>
    )
  }
}
