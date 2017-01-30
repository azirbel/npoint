import React, { Component } from 'react';
import { Link } from 'react-router'
import Document from '../models/Document';
import JsonEditor from '../components/JsonEditor';

export default class DocumentPage extends Component {
  state = {
    title: '',
    contents: '',
    isLoading: true,
    isSaving: false,
    canSave: true,
  }

  componentDidMount() {
    this.setState({ isLoading: true })
    Document.get(this.props.params.documentId).then((response) => {
      this.setState({
        title: response.data.document.title,
        contents: JSON.stringify(response.data.document.contents, null, 2),
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

  render() {
    return (
      <div>
        <header>
          <div className="container header-container">
            <h1>{this.state.title}</h1>
            <Link className='button primary' to='/'>New</Link>
          </div>
        </header>
        <div className="container">
          <JsonEditor
            value={this.state.contents}
            onChange={(e) => this.updateJson(e.target.value)}
          />
          {this.state.isSaving ? <p>Saving...</p> : ''}
          {this.state.canSave ? '' : <p>Cannot save.</p>}
          <p className='text-center'>
            <Link to='/documents'>Back to all documents</Link>
          </p>
        </div>
      </div>
    );
  }
}
