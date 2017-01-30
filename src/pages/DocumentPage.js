import React, { Component } from 'react';
import { Link } from 'react-router'
import Document from '../models/Document';

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
        contents: JSON.stringify(response.data.document.contents),
        isLoading: false
      })
    })
  }

  render() {
    return (
      <div>
        <header>
          <div className="container header-container">
            <h1>{this.state.title}</h1>
            <button className="button">Publish</button>
          </div>
        </header>
        <div className="container">
          <Link to='/'>Back to all documents</Link>
          <input
            type='textarea'
            value={this.state.contents}
            onChange={(e) => this.updateJson(e.target.value)}/>
          {this.state.isSaving ? <p>Saving...</p> : ''}
          {this.state.canSave ? '' : <p>Cannot save.</p>}
        </div>
      </div>
    );
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
}
