// @format

/* global axios */

import React, { Component } from 'react'
import ReactMarkdown from 'react-markdown'
import { MdDone, MdStarOutline } from 'react-icons/lib/md'

import Button from '../components/Button'
import JsonEditor from '../components/JsonEditor'
import Header from '../components/Header'
import Footer from '../components/Footer'
import createNewDocument from '../helpers/createNewDocument'

import {} from './IndexPage.css'

export default class IndexPage extends Component {
  state = {
    newDocumentContents: JSON.stringify(
      {
        what: 'a simple JSON data store',
        why: ['quick setup', 'easy editing', '(coming soon) validation'],
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
      <div className="index-page">
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
              that won{"'"}t break your app
            </h1>
            <p>
              Set up a lightweight JSON endpoint in seconds,
              <br />
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
                  Save
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
                  Use n:point as a lightweight<br />backend while you prototype<br />your
                  app or website.
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
                  . When you{"'"}re ready, lock the schema so it can never
                  change again.
                </p>
              </div>
            </div>
            <div className="usage-row">
              <div className="text-right">
                <div className="usage-step-number">3.</div>
                <h3>Edit with a friend</h3>
                <p>
                  Let others make changes to the<br />saved data. With the
                  schema<br />
                  locked, you can be sure edits<br />won{"'"}t break your app.
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
                  src="img/demo-screenshot.png"
                />
              </div>
              <div className="col-xs-12">
                <ol className="prose">
                  <li>Quickly catch errors</li>
                  <li>Javascript sytax is allowed</li>
                  <li>Add a schema</li>
                  <li>
                    Lock the schema to guarantee the JSON structure will never
                    change
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        <div className="section">
          <div className="container">
            <div className="prose">
              <h2>Features</h2>
              <p className="text-italic">
                This list is built on n:point!<br />Check it out at{' '}
                <a target="_blank" href="https://www.npoint.io/docs/features">
                  npoint.io/docs/features
                </a>, or via the API at{' '}
                <a target="_blank" href="https://api.npoint.io/features">
                  api.npoint.io/features
                </a>
                .
              </p>
            </div>
            <ul>
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
              <h2>Premium Features</h2>
              <p className="text-italic">
                Want any of the features below? Let us know via the chat widget
                in the bottom right!
              </p>
            </div>
            <ul>
              {this.state.premiumFeatures.map(feature => (
                <li key={feature.title} className="feature">
                  <MdStarOutline className="feature-icon" />
                  <div>
                    <h3>{feature.title}</h3>
                    <ReactMarkdown source={feature.description} />
                  </div>
                </li>
              ))}
            </ul>
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
                Edit a sample document
              </Button>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    )
  }
}
