import React, { Component } from 'react';
import { Link } from 'react-router'
import Document from '../models/Document';
import JsonEditor from '../components/JsonEditor';
import Header from '../components/Header'
import { MdDone, MdEdit } from 'react-icons/lib/md';
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

  componentDidMount() {
    this.setState({ isLoading: true })
    Document.get(this.props.params.documentId).then((response) => {
      this.setState({
        title: response.data.title,
        contents: JSON.stringify(response.data.contents, null, 2),
        isLoading: false
      })
    })
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
    Document.update(this.props.params.documentId, {
      contents: newValue,
    }).then(() => {
      this.setState({ isSaving: false })
    })
  }

  saveNewTitle() {
    Document.update(this.props.params.documentId, {
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
        <div className="container">
          <JsonEditor
            value={this.state.contents}
            onChange={(e) => this.updateJson(e.target.value)}
          />
          {this.state.isSaving ? <p>Saving...</p> : ''}
          {this.state.canSave ? '' : <p>Cannot save.</p>}
          <p className='text-center'>
            This document is available at&nbsp;
            <a target='_blank'
              href={`http://api.npoint.io/${this.props.params.documentId}`}>
              {`api.npoint.io/${this.props.params.documentId}`}
            </a>
          </p>
          <p className='text-center'>
            <Link to='/docs'>View all documents</Link>
          </p>
        </div>
      </div>
    );
  }
}
