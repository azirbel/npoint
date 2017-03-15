import React, { Component } from 'react';
import Document from '../models/Document';
import JsonEditor from '../components/JsonEditor';
import Header from '../components/Header'
import {} from './DocumentPage.css';

export default class DocumentPage extends Component {
  state = {
    title: '',
    contents: '',
    isLoading: true,
    isSaving: false,
    isEditingTitle: false,
    canSave: true,
  }

  loadDocument(token) {
    this.setState({ isLoading: true })
    Document.get(token).then((response) => {
      this.setState({
        title: response.data.title,
        contents: JSON.stringify(response.data.contents, null, 2),
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
      this.setState({ isSaving: false, canSave: false })
      return;
    }

    this.setState({ isSaving: true, canSave: true })
    Document.update(this.props.params.documentToken, {
      contents: newValue,
    }).then(() => {
      this.setState({ isSaving: false })
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
      <div>
        <Header title={this.state.title} />
        <div className="section container">
          <JsonEditor
            value={this.state.contents}
            onChange={newValue => this.updateJson(newValue)}
          />
          {this.state.isSaving ? <p>Saving...</p> : ''}
          {this.state.canSave ? '' : <p>Cannot save.</p>}
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
}
