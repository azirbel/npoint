// @format

import React, { Component } from 'react'
import Logo from '../components/Logo'
import Input from '../components/Input'
import Badge from '../components/Badge'
import { Tabs, Tab } from '../components/Tabs'
import {} from './StyleguidePage.css'

export default class StyleguidePage extends Component {
  render() {
    return (
      <div>
        <div className="section blue">
          <div className="container">
            <h1 className="title text-white">Styleguide</h1>
          </div>
        </div>
        <div className="section">
          <div className="container">
            <h1 className="prose">Badge</h1>
            <Badge label="Beta" />
            <Badge label="Beta" classNames="warning" />
          </div>
        </div>
        <div className="section">
          <div className="container">
            <h1 className="prose">Input</h1>
            <Input label="Name" />
          </div>
        </div>
        <div className="section">
          <div className="container">
            <h1 className="prose">Tabs</h1>
            <h3>Inline</h3>
            <Tabs>
              <Tab value="sign-in">Sign in</Tab>
              <Tab value="sign-up">Sign up</Tab>
            </Tabs>
            <h3>Full Width</h3>
            <Tabs fullWidth={true}>
              <Tab value="sign-in">Sign in</Tab>
              <Tab value="sign-up">Sign up</Tab>
            </Tabs>
          </div>
        </div>
        <div className="section">
          <div className="container">
            <h1 className="prose">Logo</h1>
            <Logo />
            <Logo small={true} />
          </div>
        </div>
        <div className="section">
          <div className="container">
            <h1 className="prose">Headers</h1>
            <h2>Header 2</h2>
            <h3>Header 3</h3>
            <h5>Header 5</h5>
            <p>Paragraph text</p>
          </div>
        </div>
        <div className="section">
          <div className="container">
            <h1 className="prose">Buttons</h1>
            <div className="button-group">
              <button className="button">.button</button>
              <button className="button primary">.button.primary</button>
              <button className="button danger">.button.danger</button>
            </div>
            <br />
            <div className="button-group">
              <button className="button small">.button.small</button>
              <button className="button small primary">
                .button.small.primary
              </button>
            </div>
            <br />
            <div className="button-group">
              <button className="button large">.button.large</button>
              <button className="button large primary">
                .button.large.primary
              </button>
              <button className="button large cta">.button.large.cta</button>
            </div>
            <br />
            <div className="button-group">
              <a>real link</a>
              <button className="button link">.button.link</button>
              <button className="button subtle">.button.subtle</button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
