// @format

import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import Logo from '../components/Logo'
import Input from '../components/Input'
import Button from '../components/Button'
import { Tabs, Tab } from '../components/Tabs'
import {} from './StyleguidePage.css'

export default class StyleguidePage extends Component {
  state = {
    isLoading: false,
    inputVal: '',
  }

  toggleIsLoading = () => {
    this.setState({ isLoading: !this.state.isLoading })
  }

  onInputChange = newVal => {
    this.setState({ inputVal: newVal })
  }

  render() {
    return (
      <div>
        <Helmet>
          <title>Styleguide</title>
        </Helmet>
        <div className="section blue">
          <div className="container">
            <h1 className="title text-white">Styleguide</h1>
          </div>
        </div>
        <div className="section">
          <div className="container">
            <h1 className="prose">Badges</h1>
            <div className="badge-group">
              <div className="badge">.badge</div>
              <div className="badge warning">.badge.warning</div>
              <div className="badge danger">.badge.danger</div>
              <div className="badge dark-gray">.badge.dark-gray</div>
              <div className="badge primary">.badge.primary</div>
            </div>
          </div>
        </div>
        <div className="section">
          <div className="container">
            <h1 className="prose">Input</h1>
            <Input
              label="Name"
              value={this.state.inputVal}
              onChange={this.onInputChange}
            />
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
            <Button onClick={this.toggleIsLoading}>Toggle loading</Button>
            <br />
            <div className="button-group">
              <Button isLoading={this.state.isLoading}>Default</Button>
              <Button isLoading={this.state.isLoading} className="primary">
                .primary
              </Button>
              <Button isLoading={this.state.isLoading} className="danger">
                .danger
              </Button>
            </div>
            <br />
            <div className="button-group">
              <Button isLoading={this.state.isLoading} className="small">
                .small
              </Button>
              <Button
                isLoading={this.state.isLoading}
                className="small primary"
              >
                .small.primary
              </Button>
            </div>
            <br />
            <div className="button-group">
              <Button isLoading={this.state.isLoading} className="large">
                .large
              </Button>
              <Button
                isLoading={this.state.isLoading}
                className="large primary"
              >
                .large.primary
              </Button>
              <Button isLoading={this.state.isLoading} className="large cta">
                .large.cta
              </Button>
            </div>
            <br />
            <div className="button-group">
              <a>real link</a>
              <Button className="link">.link</Button>
              <Button isLoading={this.state.isLoading} className="subtle">
                .subtle
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }
}
