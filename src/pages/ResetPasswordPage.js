import React, { Component } from 'react'
import { connect } from 'react-redux'
import User from '../models/User'
import Header from '../components/Header'
import Input from '../components/Input'
import { logIn } from '../actions'
import { push } from 'react-router-redux'
import {} from './ResetPasswordPage.css'
import _ from 'lodash'

class ResetPasswordPage extends Component {
  state = {
    password: '',
    confirmPassword: '',
    attemptedReset: false,
  }

  resetPassword = () => {
    let { dispatch } = this.props

    if (this.state.password !== this.state.confirmPassword) {
      this.setState({ attemptedReset: true })
      return
    }

    let resetToken = _.get(this.props, ['location', 'query', 'token'])
    User.resetPassword({
      password: this.state.password,
      reset_token: resetToken,
    }).then(response => {
      let { name, email, avatar_url } = response
      debugger
      dispatch(logIn({ name, email, avatar_url }))
      dispatch(push('/docs'))
    })
  }

  render() {
    let passwordsMatch = this.state.password === this.state.confirmPassword

    return (
      <div className="reset-password-page">
        <Header>
          <h1 className="page-title">Reset Password</h1>
          <div className="flex-spring" />
        </Header>
        <div className="container">
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
          />
          <button
            className="button primary"
            type="submit"
            onClick={this.resetPassword}
          >
            Reset
          </button>
          {this.state.attemptedReset &&
            !passwordsMatch && (
              <div className="text-error">Passwords must match.</div>
            )}
        </div>
      </div>
    )
  }
}

export default connect()(ResetPasswordPage)
