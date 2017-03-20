import React, { Component } from 'react'
import Document from '../models/Document'
import JsonEditor from '../components/JsonEditor'
import Header from '../components/Header'
import JsonErrorParser from '../helpers/json-error-parser'
import { MdDone, MdEdit, MdLock } from 'react-icons/lib/md'
import {} from './DocumentPage.css';
import _ from 'lodash';

export default class DocumentPage extends Component {
  state = {
    title: '',
    contents: '',
    editable: false,
    isLoading: true,
    isSaving: false,
    isEditingTitle: false,
    errorMessage: '',
  }

  loadDocument(token) {
    this.setState({ isLoading: true })
    Document.get(token).then((response) => {
      this.setState({
        title: response.data.title,
        contents: JSON.stringify(response.data.contents, null, 2),
        editable: response.data.editable,
        isLoading: false
      })
    })
  }

  componentDidMount() {
    this.loadDocument(this.props.params.documentToken)
  }

  componentWillReceiveProps(newProps) {
    if (newProps.params.documentToken !== this.props.params.documentToken) {
      this.loadDocument(newProps.params.documentToken)
    }
  }

  updateJson(newValue) {
    this.setState({ contents: newValue })

    try {
      JSON.parse(newValue)
    } catch (e) {
      let errorMessage = JsonErrorParser.readableErrorMessage(newValue, e)
      this.setState({ isSaving: false, errorMessage })
      return;
    }

    this.setState({ isSaving: true, errorMessage: '' })
    Document.update(this.props.params.documentToken, {
      contents: newValue,
    }).then(() => {
      this.setState({ isSaving: false })
    }, () => {
      this.setState({ isSaving: false, errorMessage: 'Server error, could not save' })
    })
  }

  saveNewTitle() {
    Document.update(this.props.params.documentToken, {
      title: this.state.title,
    }).then(() => {
      this.setState({ isEditingTitle: false });
    })
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.saveNewTitle()
    }
  }

  render() {
    return (
      <div className='document-page'>
        <Header>
          {this.renderEditableTitle()}
        </Header>
        {!this.state.isLoading && !this.state.editable && (
          <div className="banner dark-gray">
            <div className="container flex align-center justify-center">
              <MdLock className='locked-icon'/>
              This document belongs to another user. Log in to make changes, or make a copy.
            </div>
          </div>
        )}
        <div className="section container">
          <JsonEditor
            value={this.state.contents}
            onChange={_.debounce((newValue) => this.updateJson(newValue), 1000)}
            readOnly={!this.state.editable}
          />
          <p className='text-right'>
            {
              (this.state.isSaving && 'Saving...') ||
              this.state.errorMessage ||
              'Saved'
            }
          </p>
          <p className='text-center'>
            This document is available at&nbsp;
            <a target='_blank'
              href={`http://api.npoint.io/${this.props.params.documentToken}`}>
              {`api.npoint.io/${this.props.params.documentToken}`}
            </a>
          </p>
        </div>
      </div>
    );
  }

  renderEditableTitle() {
    return this.state.isEditingTitle ? (
      <div className='flex align-center'>
        <input
          className='edit-title-input page-title'
          value={this.state.title}
          onKeyPress={(e) => this.handleKeyPress(e)}
          onChange={(e) => this.setState({ title: e.target.value })}
        />
        <button
          className='button link square edit-title-button'
          onClick={() => this.saveNewTitle()}
        >
          <MdDone/>
        </button>
      </div>
    ) : (
      <div className='flex align-center'>
        <h1 className='page-title'>{this.state.title}</h1>
        {this.state.editable && (
          <button
            className='button link square edit-title-button'
            onClick={() => this.setState({ isEditingTitle: true })}
          >
            <MdEdit/>
          </button>
        )}
      </div>
    )
  }
}
