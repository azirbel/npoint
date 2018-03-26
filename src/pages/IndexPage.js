// @format

import React, { Component } from 'react'
import JsonEditor from '../components/JsonEditor'
import Document from '../models/Document'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { MdFlashOn, MdEdit, MdLock } from 'react-icons/lib/md'
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
  }

  createNewDocument = () => {
    Document.create({
      title: 'Untitled',
      contents: this.state.newDocumentContents,
    }).then(response => {
      this.props.router.push(`/docs/${response.data.token}`)
    })
  }

  render() {
    return (
      <div className="index-page">
        <Header fullLogo={true}>
          <div className="flex-spring" />
          <button className="button primary" onClick={this.createNewDocument}>
            + New
          </button>
        </Header>
        <div className="section dark-white index-splash">
          <div className="container prose text-center">
            <h1 className="title index-title">
      JSON Storage That Won{"'"}t Break Your App</h1>
            <p>
      Set up a lightweight JSON endpoint in seconds, then add schema validation
      <br/>
      so that you don{"'"}t accidentally break your app as you edit the data.
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
                <button
                  className="button cta large"
                  onClick={() => this.createNewDocument()}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="section">
          <div className="container prose">
            <h2>Prototype Safely</h2>
            <p>
              n:point is a lightweight data store for your app or prototype.
            </p>
            <p>
              Save FAQ answers, customer stories, configuration data, or
              anything else that will fit in a JSON blob. Then access your data
              directly via API.
            </p>
            <p>
              Once your app is live, come back later to edit your saved JSON
              without having to redeploy. Or share edit permissions with a
              friend so they can help you experiment! Features like [lockdown]
              and [schemas] mean you can make these changes confidently, without
              breaking your app.
            </p>
          </div>
        </div>
        <div className="section">
          <div className="container prose">
            <div className="row">
              <div className="col-xs-6">
                <img width="100%" src="img/step-1.png" role="presentation" />
              </div>
              <div className="col-xs-6">
                <h3>Store JSON online</h3>
                <p>
                  Use n:point as a lightweight backend while you prototype your
                  app
                </p>
              </div>
            </div>
            <div className="row">
              <div className="col-xs-6">
                <h3>Lock the schema</h3>
                <p>
                  Add{' '}
                  <a target="_blank" href="http://json-schema.org/">
                    JSON Schema
                  </a>{' '}
                  to enforce the structure of your data. When you{"'"}re ready,
                  lock the schema so it can never change again.
                </p>
              </div>
              <div className="col-xs-6">
                <img width="100%" src="img/step-2.png" role="presentation" />
              </div>
            </div>
            <div className="row">
              <div className="col-xs-6">
                <img width="100%" src="img/step-3.png" role="presentation" />
              </div>
              <div className="col-xs-6">
                <h3>Edit with a friend</h3>
                <p>
                  Let others make changes to the saved JSON data. With the
                  schema locked, you can be sure their edits won{"'"}t break
                  your app.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="section">
          Features
        </div>

        <div className="section dark-white">
          Demo video
        </div>

        <div className="section">
          <div className="container prose">
            <div className="row">
              <div className="col-xs-4">
                <div className="flex column align-center text-center">
                  <div className="icon-benefit">
                    <MdFlashOn />
                  </div>
                  <h3>Set up fast</h3>
                  <p>
                    Quickly set up JSON data to power your app. Don't even worry
                    about formal JSON syntax - n:point can infer missing quotes
                    and more.
                  </p>
                </div>
              </div>
              <div className="col-xs-4">
                <div className="flex column align-center text-center">
                  <div className="icon-benefit">
                    <MdEdit />
                  </div>
                  <h3>Edit anytime</h3>
                  <p>
                    Come back later to edit your data. If you've saved your data
                    under your n:point account, others can use it via API but
                    only you can edit it.
                  </p>
                </div>
              </div>
              <div className="col-xs-4">
                <div className="flex column align-center text-center">
                  <div className="icon-benefit">
                    <MdLock />
                  </div>
                  <h3>Lock the schema</h3>
                  <p>
                    n:point can infer a schema from your existing data. Lock the
                    schema to make sure the structure of your data never changes
                    (so your app won't break).
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}
