import React, { Component } from 'react'
import JsonEditor from '../components/JsonEditor'
import Document from '../models/Document'
import Header from '../components/Header'
import Footer from '../components/Footer'
import {} from './IndexPage.css'

export default class IndexPage extends Component {
  state = {
    newDocumentContents: JSON.stringify({
      what: 'a simple JSON data store',
      why: [
        'quick setup',
        'easy editing',
        '(coming soon) validation',
      ]
    }, null, 2)
  }

  createNewDocument() {
    Document.create({
      title: 'Untitled',
      contents: this.state.newDocumentContents,
    }).then((response) => {
      this.props.router.push(`/docs/${response.data.token}`)
    })
  }

  render() {
    return (
      <div className='index-page'>
        <Header />
        <div className="section dark-white index-splash">
          <div className="container">
            <h1 className="title text-center index-title">
              Simple, powerful JSON endpoints
            </h1>
            <div className="index-editor-container">
              <JsonEditor
                rows={9}
                value={this.state.newDocumentContents}
                onChange={e => this.setState({ newDocumentContents: e.target.value })}
              />
              <div className="index-editor-buttons flex justify-center">
                <button
                  className="button primary large"
                  onClick={() => this.createNewDocument()}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="section text-center">
          <div className="container">
            <h2>
              Don't waste time making an edit interface<br/>for your static content
            </h2>
            <p>
              Static content like FAQ pages or customer stories should feel like
              part of your site. But it's important to have an interface for it,
              so it doesn't get stale.
            </p>
            <p>
              Create easily
            </p>
            <p>
              Log in to edit when your content changes
            </p>
          </div>
        </div>
        <div className="section text-center">
          <div className="container">
            <h2>
              Prototype fast, then move to production in... 0 steps
            </h2>
            <p>
              Cloudflare CDN [premium]
            </p>
            <p>
              Validations
            </p>
            <p>
              Lockdown
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
