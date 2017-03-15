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
                onChange={newValue => this.setState({ newDocumentContents: newValue })}
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
            <p className="text-center product-description">
              Save your JSON data, then access it via the API. For example,&nbsp;
              <a target='_blank' href='api.lvh.me:3001/sample'>
                api.npoint.io/sample
              </a>.
            </p>
          </div>
        </div>
        <div className="section text-center">
          <div className="container">
            <h2>
              A simple interface for your website's static content
            </h2>
            <div className="row feature-row">
              <div className="col-xs-12 col-sm-6">
                <h4>Edit static parts of your site without code changes</h4>
                <p>
                  You should be able to edit static parts of your site (like FAQ pages
                  or customer reviews) without making code changes or doing a deploy.
                </p>
              </div>
              <div className="hidden-xs-down col-sm-6">
                <div className="diagram-placeholder">(placeholder)</div>
              </div>
            </div>
            <div className="row feature-row">
              <div className="hidden-xs-down col-sm-6">
                <div className="diagram-placeholder">(placeholder)</div>
              </div>
              <div className="col-xs-12 col-sm-6">
                <h4>Get set up fast, then log in to edit your content later.</h4>
                <p>
                  Something something something something.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="section text-center">
          <div className="container">
            <h2>
              Prototype fast, then move to production in 0 steps
            </h2>
            <div className="row feature-row">
              <div className="col-xs-12 col-sm-6">
                <h4>CORS support</h4>
                <p>
                  n:point sets<br/>
                  <code>Access-Control-Allow-Origin: *</code><br/> by default (and it
                  can be customized).
                </p>
              </div>
              <div className="hidden-xs-down col-sm-6">
                <div className="diagram-placeholder">(placeholder)</div>
              </div>
            </div>
            <div className="row feature-row">
              <div className="hidden-xs-down col-sm-6">
                <div className="diagram-placeholder">(placeholder)</div>
              </div>
              <div className="col-xs-12 col-sm-6">
                <h4>Cloudfare CDN [premium]</h4>
                <p>
                  Something something something something.
                </p>
              </div>
            </div>
            <div className="row feature-row">
              <div className="col-xs-12 col-sm-6">
                <h4>Validations</h4>
                <p>
                  Something something something something.
                </p>
              </div>
              <div className="hidden-xs-down col-sm-6">
                <div className="diagram-placeholder">(placeholder)</div>
              </div>
            </div>
            <div className="row feature-row">
              <div className="hidden-xs-down col-sm-6">
                <div className="diagram-placeholder">(placeholder)</div>
              </div>
              <div className="col-xs-12 col-sm-6">
                <h4>Lockdown</h4>
                <p>
                  Something something something something.
                </p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}
