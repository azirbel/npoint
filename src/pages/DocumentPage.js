import React, { Component } from 'react'
import Document from '../models/Document'
import Schema from '../models/Schema'
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
    originalSchema: '',
    contents: null,
    schema: null,
    editable: false,
    isLoading: true,
    isSaving: false,
    isEditingTitle: false,
    errorMessage: '',
    schemaErrors: [],
    savedOriginalContents: '',
    savedOriginalSchema: '',
  }

  sandboxedIframe: null

  loadDocument(token) {
    this.setState({ isLoading: true })

    Document.get(token).then((response) => {
      this.setState({
        title: response.data.title,
        contents: response.data.contents,
        originalContents: response.data.original_contents,
        savedOriginalContents: response.data.original_contents,
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
  }

  async updateSchema(newOriginalSchema) {
    this.setState({ originalSchema: newOriginalSchema })
    console.log(newOriginalSchema)

    let { json, errorMessage } =
      await evalParseObject(newOriginalSchema, this.sandboxedIframe)

    if (!json) {
      // TODO(azirbel): Log this to some logging service
      // TODO(azirbel): Test in older browsers

      // Fallback to naive JSON parse - old browsers can still use this
      try {
        json = JSON.parse(newOriginalSchema)
      } catch (e) {
        this.setState({
          isSaving: false,
          errorMessage: errorMessage ?
            readableEvalError(errorMessage) :
            readableParseError(newOriginalSchema, e)
        })
        return;
      }
    }

    Schema.validate({
      schema: JSON.stringify(json),
      contents: JSON.stringify(this.state.contents)
    }).then(({ data }) => {
      let { errors } = data;
      console.log('errs:', errors);
      this.setState({ schemaErrors: errors });
    });
  }

  generateSchema = async () => {
    Schema.generate({
      contents: JSON.stringify(this.state.contents)
    }).then(({ data }) => {
      console.log('generated!');
      console.log('data:', data);
      this.setState({
        schema: data.schema,
        originalSchema: data.original_schema,
      });
    });
  }

  saveNewTitle = () => {
    Document.update(this.props.params.documentToken, {
      title: this.state.title,
    }).then(() => {
      this.setState({ isEditingTitle: false });
    })
  }

  saveDocument = () => {
    let saveState = _.cloneDeep(this.state);

    Document.update(this.props.params.documentToken, {
      contents: JSON.stringify(saveState.contents),
      original_contents: saveState.originalContents,
    }).then(() => {
      this.setState({
        savedOriginalContents: saveState.originalContents,
        savedOriginalSchema: saveState.originalSchema,
      });
    })
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.saveNewTitle()
    }
  }

  render() {
    let liveUrl = `api.npoint.io/${this.props.params.documentToken}`;
    let hasSaved = this.state.originalContents === this.state.savedOriginalContents;

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
          <div className="button-group">
            {hasSaved ? (
              <button disabled className="button primary disabled">Saved</button>
            ) : (
              <button className="button primary" onClick={this.saveDocument}>Save</button>
            )}
            <button className="button secondary" onClick={this.generateSchema}>Generate schema</button>
          </div>
        </div>
        <div className="section container">
          <div className="row">
            <div className="col-xs-12 col-sm-6">
              <JsonEditor
                value={this.state.originalContents}
                onChange={_.debounce((newValue) => this.updateJson(newValue), 1000)}
                readOnly={!this.state.editable}
              />
            </div>
            <div className="col-xs-12 col-sm-6">
              <JsonEditor
                value={this.state.originalSchema}
                onChange={_.debounce((newValue) => this.updateSchema(newValue), 1000)}
                readOnly={!this.state.editable}
              />
              <div className='text-right'>
                {this.state.schemaErrors.map((se, idx) => (
                  <p key={idx}>{se}</p>
                ))}
              </div>
            </div>
          </div>
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
          onClick={this.saveNewTitle}
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
