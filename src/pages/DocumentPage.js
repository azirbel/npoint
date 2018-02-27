import React, { Component } from 'react'
import Document from '../models/Document'
import JsonEditor from '../components/JsonEditor'
import Header from '../components/Header'
import { IFRAME_SRC_DOC, evalParseObject } from '../helpers/sandboxedEval'
import { readableEvalError, readableParseError } from '../helpers/readableJsonError'
import { MdDone, MdEdit, MdLock } from 'react-icons/lib/md'
import {} from './DocumentPage.css';
import _ from 'lodash';

export default class DocumentPage extends Component {
  state = {
    title: '',
    originalContents: '',
    editable: false,
    isLoading: true,
    isSaving: false,
    isEditingTitle: false,
    errorMessage: '',
  }

  sandboxedIframe: null

  loadDocument(token) {
    this.setState({ isLoading: true })
    Document.get(token).then((response) => {
      this.setState({
        title: response.data.title,
        originalContents: response.data.original_contents,
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

  async updateJson(newOriginalContents) {
    this.setState({ originalContents: newOriginalContents })

    let { json, errorMessage } =
      await evalParseObject(newOriginalContents, this.sandboxedIframe)

    if (!json) {
      // TODO(azirbel): Log this to some logging service
      // TODO(azirbel): Test in older browsers

      // Fallback to naive JSON parse - old browsers can still use this
      try {
        json = JSON.parse(newOriginalContents)
      } catch (e) {
        this.setState({
          isSaving: false,
          errorMessage: errorMessage ?
            readableEvalError(errorMessage) :
            readableParseError(newOriginalContents, e)
        })
        return;
      }
    }


    this.setState({ isSaving: true, errorMessage: '' })
    Document.update(this.props.params.documentToken, {
      original_contents: newOriginalContents,
      contents: JSON.stringify(json),
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
    let liveUrl = `api.npoint.io/${this.props.params.documentToken}`;

    return (
      <div className='document-page'>
        <Header>
          {this.renderEditableTitle()}
        </Header>
        <iframe
          className='hidden-iframe'
          sandbox='allow-scripts'
          srcDoc={IFRAME_SRC_DOC}
          ref={(el) => this.sandboxedIframe = el}
          key={this.props.params.documentToken}
        >
        </iframe>
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
            value={this.state.originalContents}
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
              href={liveUrl}>
              {liveUrl}
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
