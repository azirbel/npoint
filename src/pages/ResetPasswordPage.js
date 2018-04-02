// @format

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { push } from 'react-router-redux'
import _ from 'lodash'

import Downfade from '../components/animations/Downfade'
import User from '../models/User'
import Header from '../components/Header'
import Input from '../components/Input'
import { logIn } from '../actions'

import {} from './ResetPasswordPage.css'

class ResetPasswordPage extends Component {
  state = {
    password: '',
    confirmPassword: '',
    resetError: '',
  }

  resetPassword = () => {
    let { dispatch } = this.props

    if (_.isEmpty(this.state.password)) {
      this.setState({ resetError: 'Please set a new password.' })
      return
    } else if (this.state.password !== this.state.confirmPassword) {
      this.setState({ resetError: 'Passwords must match.' })
      return
    }

    let resetToken = _.get(this.props, ['location', 'query', 'token'])
    User.resetPassword({
      password: this.state.password,
      reset_token: resetToken,
    })
      .then(response => {
        if (response.data.errors) {
          this.setState({ resetError: response.data.errors.join(', ') })
          return
        }

        let { name, email, avatarUrl } = response.data
        dispatch(logIn({ name, email, avatarUrl }))

        // Timeout so the login animation can finish
        setTimeout(() => {
          dispatch(push('/docs'))
        }, 400)
      })
      .catch(() => {
        this.setState({
          resetError: 'Error setting password - link may be expired.',
        })
      })
  }

  render() {
    return (
      <div className="reset-password-page">
        <Header>
          <h1 className="page-title">Reset Password</h1>
          <div className="flex-spring" />
        </Header>
        <Helmet>
          <title>Reset Password</title>
        </Helmet>
        <div className="container">
          <div className="reset-form form spaced-children">
            <Input
              label="New password"
              type="password"
              value={this.state.password}
              onChange={password => this.setState({ password })}
            />
            <Input
              label="Confirm new password"
              type="password"
              value={this.state.confirmPassword}
              onChange={confirmPassword => this.setState({ confirmPassword })}
              onEnter={this.resetPassword}
            />
            <button
              className="button primary"
              type="submit"
              onClick={this.resetPassword}
            >
              Reset
            </button>
            <Downfade>
              {this.state.resetError && (
                <div key={this.state.resetError} className="text-error">
                  {this.state.resetError}
                </div>
              )}
            </Downfade>
          </div>
        </div>
      </div>
    )
  }
}

export default connect()(ResetPasswordPage)
