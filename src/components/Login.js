// @format

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import User from '../models/User'
import Session from '../models/Session'
import { logIn } from '../actions'
import { Tabs, Tab } from '../components/Tabs'
import Input from './Input'
import {} from './Login.css'

class Login extends Component {
  static propTypes = {
    onLogin: PropTypes.func.isRequired,
  }

  state = {
    tab: 'log-in',
    name: '',
    email: '',
    password: '',
    isResettingPassword: false,
    resetPasswordEmailSent: false,
    resetPasswordSentToEmail: '',
  }

  handleSignup = e => {
    let { dispatch } = this.props
    User.create({
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password_confirmation: this.state.password,
    }).then(response => {
      let { name, email, avatar_url } = response.data
      dispatch(logIn({ name, email, avatar_url }))
      this.props.onLogin()
    })
    e.preventDefault()
  }

  handleLogin = e => {
    let { dispatch } = this.props
    Session.login({
      email: this.state.email,
      password: this.state.password,
    }).then(response => {
      let { name, email, avatar_url } = response.data
      dispatch(logIn({ name, email, avatar_url }))
      this.props.onLogin()
    })
    e.preventDefault()
  }

  handleForgotPassword = () => {
    this.setState({ isResettingPassword: true })
  }

  cancelForgotPassword = () => {
    this.setState({ isResettingPassword: false })
  }

  sendResetLink = () => {
    this.setState({
      resetPasswordSentToEmail: this.state.email,
    })

    User.sendResetPasswordEmail({ email: this.state.email }).then(() => {
      this.setState({ resetPasswordEmailSent: true })
    })
  }

  render() {
    return (
      <div className="login-component">
        <Tabs
          fullWidth={true}
          onChange={tab => this.setState({ tab })}
          initialValue="log-in"
        >
          <Tab value="log-in">Log in</Tab>
          <Tab value="sign-up">Sign up</Tab>
        </Tabs>
        {this.state.tab === 'log-in'
          ? this.state.isResettingPassword
            ? this.renderForgotPasswordForm()
            : this.renderLogInForm()
          : this.renderSignInForm()}
        {this.state.resetPasswordEmailSent && (
          <div className="text-success">
            Sent password reset email to
            {this.state.resetPasswordSentToEmail}. Check your inbox!
          </div>
        )}
      </div>
    )
  }

  renderLogInForm() {
    return (
      <div className="form padded vertical-input-group">
        <Input
          label="Email"
          type="email"
          value={this.state.email}
          onChange={email => this.setState({ email })}
        />
        <Input
          label="Password"
          type="password"
          value={this.state.password}
          onChange={password => this.setState({ password })}
        />
        <div className="flex justify-end">
          <button className="button link" onClick={this.handleForgotPassword}>
            (Forgot?)
          </button>
          <button className="button primary" onClick={this.handleLogin}>
            Log in
          </button>
        </div>
      </div>
    )
  }

  renderSignInForm() {
    return (
      <div className="form padded vertical-input-group">
        <Input
          label="First name"
          value={this.state.name}
          onChange={name => this.setState({ name })}
        />
        <Input
          label="Email"
          type="email"
          value={this.state.email}
          onChange={email => this.setState({ email })}
        />
        <Input
          label="Choose a password"
          type="password"
          value={this.state.password}
          onChange={password => this.setState({ password })}
        />
        <div className="flex justify-end">
          <button className="button primary" onClick={this.handleSignup}>
            Sign up
          </button>
        </div>
      </div>
    )
  }

  renderForgotPasswordForm() {
    return (
      <div className="form padded vertical-input-group">
        <Input
          label="Email"
          type="email"
          value={this.state.email}
          onChange={email => this.setState({ email })}
        />
        <p>
          No worries, just fill in your email and hit "reset" - we'll send you a
          link to set a new password.
        </p>
        <div className="flex justify-end">
          <button className="button link" onClick={this.cancelForgotPassword}>
            Back
          </button>
          <button className="button primary" onClick={this.sendResetLink}>
            Reset
          </button>
        </div>
      </div>
    )
  }
}

let mapStateToProps = state => {
  return {
    session: state.session,
  }
}

export default connect(mapStateToProps)(Login)
