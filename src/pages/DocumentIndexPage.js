// @format

import React, { Component } from 'react'
import { isEmpty } from 'lodash'
import { Link } from 'react-router'
import { Helmet } from 'react-helmet'
import Tooltip from 'rc-tooltip'
import {} from './DocumentIndexPage.css'
import Document from '../models/Document'
import Header from '../components/Header'
import Button from '../components/Button'
import { MdDelete, MdLock, MdLockOutline } from 'react-icons/lib/md'
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

  deleteDocument(doc) {
    Document.delete(doc.token).then(() => {
      this.setState({ documents: without(this.state.documents, doc) })
    })
  }

  render() {
    return (
      <div>
        <Header>
          <h1 className="page-title">My Documents</h1>
          <div className="flex-spring" />
        </Header>
        <Helmet>
          <title>My Documents</title>
        </Helmet>
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
          {this.state.documents.map(doc => this.renderDocumentRow(doc))}
        </div>
      </div>
    )
  }

  renderDocumentRow(doc) {
    let linkTo = `/docs/${doc.token}`

    return (
      <Link to={linkTo} className="document-row" key={doc.token}>
        {doc.title}
        {this.renderDeleteOption(doc)}
      </Link>
    )
  }

  renderDeleteOption(doc) {
    if (doc.contentsLocked) {
      return (
        <Tooltip
          placement="bottom"
          trigger={['click', 'hover']}
          overlay="This document is locked"
        >
          <div className="badge dark-gray">
            <MdLock />
          </div>
        </Tooltip>
      )
    } else if (doc.schemaLocked) {
      return (
        <Tooltip
          placement="bottom"
          trigger={['click', 'hover']}
          overlay="The schema for this document is locked"
        >
          <div className="badge dark-gray">
            <MdLockOutline />
          </div>
        </Tooltip>
      )
    } else {
      return (
        <Button
          className="danger small"
          onClick={() => this.deleteDocument(doc)}
        >
          <MdDelete />&nbsp;Delete
        </Button>
      )
    }
  }
}
