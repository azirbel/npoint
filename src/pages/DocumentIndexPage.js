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
import Footer from '../components/Footer'
import { cacheThinDocuments } from '../actions'
import createNewDocument from '../helpers/createNewDocument'

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
    if(confirm(`Are you sure, you want to delete this pin ${doc.title} ?`)) {
      Document.delete(doc.token).then(() => {
        this.setState({ documents: _.without(this.state.documents, doc) })
      })
    }
  }

  render() {
    return (
      <div className="document-index-page page">
        <Header>
          <h1 className="page-title hidden-xs-down">My JSON Bins</h1>
          <h1 className="page-title hidden-sm-up">My Bins</h1>
          <div className="flex-spring" />
          <Button onClick={() => createNewDocument(this.props.router)}>
            + New
          </Button>
        </Header>
        <Helmet>
          <title>My JSON Bins</title>
        </Helmet>
        <div className="container main-body">
          {!this.state.isLoading &&
            isEmpty(this.state.documents) && (
              <div className="section text-center form spaced-children">
                <div>
                  Looks like you don
                  {"'"}t have any documents yet.
                </div>
                <div className="flex justify-center">
                  <Button
                    className="primary"
                    onClick={() => createNewDocument(this.props.router)}
                  >
                    Create one now!
                  </Button>
                </div>
              </div>
            )}
          {this.state.documents.map(doc => this.renderDocumentRow(doc))}
        </div>

        <div className="flex-spring" />
        <Footer />
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
          overlay="This bin is locked"
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
          overlay="The schema for this bin is locked"
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
          <MdDelete />
          &nbsp;Delete
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
