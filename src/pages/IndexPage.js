/* global axios */

import React, { Component } from 'react'
import ReactMarkdown from 'react-markdown'
import { MdDone, MdStarOutline } from 'react-icons/lib/md'
import _ from 'lodash'

import Button from '../components/Button'
import JsonEditor from '../components/JsonEditor'
import Header from '../components/Header'
import Footer from '../components/Footer'
import PageLoadingPlaceholder from '../components/PageLoadingPlaceholder'
import createNewDocument from '../helpers/createNewDocument'

import {} from './IndexPage.css'

export default class IndexPage extends Component {
  state = {
    newDocumentContents: JSON.stringify(
      {
        what: 'a simple JSON data store',
        why: ['quick setup', 'easy editing', 'schema validation'],
      },
      null,
      2
    ),
    features: [],
    premiumFeatures: [],
  }

  componentDidMount() {
    axios.get('https://api.npoint.io/features').then(({ data }) => {
      this.setState({ features: data })
    })

    axios.get('https://api.npoint.io/premium-features').then(({ data }) => {
      this.setState({ premiumFeatures: data })
    })
  }

  render() {
    return (
      <div className="index-page page">
        <Header fullLogo={true}>
          <div className="flex-spring" />
          <Button
            className="primary"
            onClick={() => createNewDocument(this.props.router)}
          >
            + New
          </Button>
        </Header>
        <div className="section dark-white index-splash">
          <div className="container prose">
            <h1 className="title index-title">
              JSON storage bins <br className="hidden-xs-down" />
              that won
              {"'"}t break your app
            </h1>
            <p>
              Set up a lightweight JSON endpoint in seconds,{' '}
              <br className="hidden-xs-down" />
              then add a{' '}
              <a target="_blank" href="http://json-schema.org/">
                schema
              </a>{' '}
              to edit your data safely at any time
            </p>
            <div className="index-editor-container">
              <JsonEditor
                rows={9}
                value={this.state.newDocumentContents}
                onChange={newValue =>
                  this.setState({ newDocumentContents: newValue })
                }
              />
              <div className="index-editor-buttons flex justify-center">
                <Button
                  className="cta large"
                  onClick={() =>
                    createNewDocument(
                      this.props.router,
                      this.state.newDocumentContents
                    )
                  }
                >
                  Create JSON Bin
                </Button>
              </div>
            </div>
          </div>
        </div>
        <div className="section">
          <div className="container prose">
            <div className="usage-row">
              <div className="text-right">
                <div className="usage-step-number">1.</div>
                <h3>Store JSON online</h3>
                <p>
                  Use n:point as a lightweight <br className="hidden-xs-down" />
                  backend while you prototype <br className="hidden-xs-down" />
                  your app or website.
                </p>
              </div>
              <div>
                <img
                  className="usage-illustration"
                  src="img/step-1.png"
                  role="presentation"
                />
              </div>
            </div>
            <div className="usage-row">
              <div>
                <img
                  className="usage-illustration"
                  src="img/step-2.png"
                  role="presentation"
                />
              </div>
              <div>
                <div className="usage-step-number">2.</div>
                <h3>Lock the schema</h3>
                <p>
                  Define the structure of your data with{' '}
                  <a target="_blank" href="http://json-schema.org/">
                    JSON Schema
                  </a>{' '}
                  . When you
                  {"'"}
                  re ready, lock the schema so it can never change again.
                </p>
              </div>
            </div>
            <div className="usage-row">
              <div className="text-right">
                <div className="usage-step-number">3.</div>
                <h3>Edit with a friend</h3>
                <p>
                  Let others make changes to the{' '}
                  <br className="hidden-xs-down" />
                  saved data. With the schema <br className="hidden-xs-down" />
                  locked, you can be sure edits{' '}
                  <br className="hidden-xs-down" />
                  won
                  {"'"}t break your app.
                </p>
              </div>
              <div>
                <img
                  className="usage-illustration"
                  src="img/step-3.png"
                  role="presentation"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="section dark-white">
          <div className="container">
            <h2 className="prose">Edit effortlessly</h2>
          </div>
          <div className="container large">
            <div className="row hidden-xs-down">
              <div className="col-xs-2">
                <div className="screenshot-notes">
                  <p className="screenshot-note-1">Quickly catch errors</p>
                  <p className="screenshot-note-2">
                    Javascript object syntax is allowed
                  </p>
                </div>
              </div>
              <div className="col-xs-8">
                <img
                  alt="Demo screenshot"
                  width="100%"
                  src="img/demo-screenshot-lines.png"
                />
              </div>
              <div className="col-xs-2">
                <div className="screenshot-notes">
                  <p className="screenshot-note-3">Add a schema</p>
                  <p className="screenshot-note-4">
                    Lock the schema to guarantee the JSON structure will never
                    change
                  </p>
                </div>
              </div>
            </div>
            <div className="row hidden-sm-up">
              <div className="col-xs-12">
                <img
                  alt="Demo screenshot"
                  width="100%"
                  src="img/demo-screenshot-dots.png"
                />
              </div>
              <div className="col-xs-12 prose">
                <p>A. Quickly catch errors</p>
                <p>B. Javascript syntax is allowed</p>
                <p>C. Add a schema</p>
                <p>
                  D. Lock the schema to guarantee the JSON structure will never
                  change
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="section">
          <div className="container">
            <div className="prose">
              <h2>Features</h2>
              <p className="text-italic">
                This list is built on n:point!
                <br />
                Check it out at{' '}
                <a target="_blank" href="https://www.npoint.io/docs/features">
                  npoint.io/docs/features
                </a>
                , or via the API at{' '}
                <a target="_blank" href="https://api.npoint.io/features">
                  api.npoint.io/features
                </a>
                .
              </p>
            </div>
            <ul>
              {_.isEmpty(this.state.features) && <PageLoadingPlaceholder />}
              {this.state.features.map(feature => (
                <li key={feature.slug} className="feature">
                  <MdDone className="feature-icon" />
                  <div>
                    <h3>{feature.title}</h3>
                    <ReactMarkdown source={feature.description} />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="section dark-white">
          <div className="container">
            <div className="prose">
              <h2>Usage and limits</h2>
              <p>
                What started out as a hobby project to help with prototyping has
                turned into a service serving over 2,000 requests/minute for
                over 25,000 JSON bins.
              </p>
              <p>
                To keep everything running smoothly, n:point now rate-limits
                requests as follows:
              </p>
              <p>
                <ul>
                  <li>
                    <b>100 requests/min</b> per IP address
                  </li>
                  <li>
                    <b>600 requests/min</b> per JSON bin
                  </li>
                </ul>
              </p>
              <p>
                n:point is a one-way JSON store: edit online, fetch via GET
                requests over API. Editing data over the API via POST requests
                is in private beta. Even once released, n:point is not meant to
                be a full backend for your app.
              </p>
              <p>
                Contact <a href="mailto:support@npoint.io">support@npoint.io</a>{' '}
                if you have any questions!
              </p>

              <h3 style={{ marginTop: 40 }}>Open source</h3>
              <p>
                n:point is completely open source and hosted on{' '}
                <a target="_blank" href="https://github.com/azirbel/npoint">
                  Github
                </a>
                .
              </p>
              <p style={{ marginBottom: 20 }}>
                Contributions are welcome! There are also instructions in case
                you want to self-host your own instance.
              </p>
              <iframe
                src="https://ghbtns.com/github-btn.html?user=azirbel&repo=npoint&type=star&count=true&size=large"
                frameborder="0"
                scrolling="0"
                width="170"
                height="30"
                title="GitHub"
              />
            </div>
          </div>
        </div>

        <div className="section">
          <div className="container prose text-center">
            <h2>Ready to try it out?</h2>
            <div className="flex justify-center">
              <Button
                className="cta large"
                onClick={() =>
                  createNewDocument(
                    this.props.router,
                    this.state.newDocumentContents
                  )
                }
              >
                Create a JSON bin
              </Button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    )
  }
}
