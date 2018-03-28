// @format

import React, { Component } from 'react'
import Tooltip from 'rc-tooltip'
import { Helmet } from 'react-helmet'
import { Link } from 'react-router'
import { connect } from 'react-redux'
import { isEmpty } from 'lodash'
import { push } from 'react-router-redux'
import { MdDelete, MdLock, MdLockOutline } from 'react-icons/lib/md'
import _ from 'lodash'

import Button from '../components/Button'
import Document from '../models/Document'
import Header from '../components/Header'
import { cacheThinDocuments } from '../actions'

import {} from './DocumentIndexPage.css'

class DocumentIndexPage extends Component {
  state = {
    documents: [],
    isLoading: true,
  }

  componentDidMount() {
    this.maybeRedirectToHomepage(this.props)
    this.setState({ isLoading: true })
    Document.query().then(
      response => {
        this.props.dispatch(cacheThinDocuments(response.data))
        this.setState({ documents: response.data, isLoading: false })
      },
      error => {}
    )
  }

  componentWillReceiveProps(newProps) {
    this.maybeRedirectToHomepage(newProps)
  }

  maybeRedirectToHomepage(props) {
    if (props.session.loaded && !props.session.loggedIn) {
      this.props.dispatch(push('/'))
    }
  }

  deleteDocument(doc) {
    Document.delete(doc.token).then(() => {
      this.setState({ documents: _.without(this.state.documents, doc) })
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

let mapStateToProps = state => {
  return {
    session: state.session,
    documents: state.documents,
  }
}

export default connect(mapStateToProps)(DocumentIndexPage)
