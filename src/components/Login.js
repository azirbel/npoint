// @format

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { MdReportProblem } from 'react-icons/lib/md'
import _ from 'lodash'

import Downfade from '../components/animations/Downfade'
import User from '../models/User'
import Session from '../models/Session'
import { logIn } from '../actions'
import { Tabs, Tab } from '../components/Tabs'
import Button from '../components/Button'
import Input from './Input'

import {} from './Login.css'

class Login extends Component {
  static propTypes = {
    onLogin: PropTypes.func.isRequired,
  }

  state = {
    email: '',
    isLoggingIn: false,
    isResettingPassword: false,
    isSigningUp: false,
    loginErrors: [],
    name: '',
    password: '',
    resetPasswordEmailSent: false,
    resetPasswordErrors: [],
    resetPasswordSentToEmail: '',
    showResetPasswordForm: false,
    signUpErrors: [],
    tab: 'log-in',
  }

  handleSignup = () => {
    this.setState({ signUpErrors: [], isSigningUp: true })
    User.create({
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      passwordConfirmation: this.state.password,
    }).then(response => {
      this.setState({ isSigningUp: false })

      if (!_.isEmpty(response.data.errors)) {
        this.setState({ signUpErrors: response.data.errors })
        return
      }

      let { name, email, avatarUrl } = response.data
      this.props.dispatch(logIn({ name, email, avatarUrl }))
      this.props.onLogin()
    })
  }

  handleLogin = () => {
    this.setState({ loginErrors: [], isLoggingIn: true })
    Session.login({
      email: this.state.email,
      password: this.state.password,
    })
      .then(response => {
        this.setState({ isLoggingIn: false })

        let { name, email, avatarUrl } = response.data
        this.props.dispatch(logIn({ name, email, avatarUrl }))
        this.props.onLogin()
      })
      .catch(error => {
        this.setState({ isLoggingIn: false })
        this.setState({ loginErrors: ['Invalid username or password'] })
      })
  }

  handleForgotPassword = () => {
    this.setState({ showResetPasswordForm: true })
  }

  cancelForgotPassword = () => {
    this.setState({ showResetPasswordForm: false })
  }

  sendResetLink = () => {
    this.setState({
      resetPasswordSentToEmail: this.state.email,
      isResettingPassword: true,
      resetPasswordErrors: [],
    })

    User.sendResetPasswordEmail({ email: this.state.email })
      .then(() => {
        this.setState({
          resetPasswordEmailSent: true,
          isResettingPassword: false,
        })
      })
      .catch(error => {
        this.setState({
          resetPasswordErrors: [
            `Could not send an email to ${
              this.state.resetPasswordSentToEmail
            }. Are you sure the account exists?`,
          ],
          isResettingPassword: false,
        })
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
          ? this.state.showResetPasswordForm
            ? this.renderForgotPasswordForm()
            : this.renderLogInForm()
          : this.renderSignUpForm()}
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
      <div className="form padded spaced-children">
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
          onEnter={this.handleLogin}
        />
        {this.renderErrors(this.state.loginErrors)}
        <div className="flex justify-end">
          <div className="button-group">
            <Button className="link" onClick={this.handleForgotPassword}>
              (Forgot?)
            </Button>
            <Button
              className="primary"
              isLoading={this.state.isLoggingIn}
              onClick={this.handleLogin}
            >
              Log in
            </Button>
          </div>
        </div>
      </div>
    )
  }

  renderSignUpForm() {
    return (
      <div className="form padded spaced-children">
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
          onEnter={this.handleSignup}
        />
        {this.renderErrors(this.state.signUpErrors)}
        <div className="flex justify-end">
          <Button
            className="primary"
            isLoading={this.state.isSigningUp}
            onClick={this.handleSignup}
          >
            Sign up
          </Button>
        </div>
      </div>
    )
  }

  renderForgotPasswordForm() {
    return (
      <div className="form padded spaced-children">
        <Input
          label="Email"
          type="email"
          value={this.state.email}
          onChange={email => this.setState({ email })}
          onEnter={this.sendResetLink}
        />
        <p className="medium">
          No worries, just fill in your email and hit "reset" - we'll send you a
          link to set a new password.
        </p>
        {this.renderErrors(this.state.resetPasswordErrors)}
        <div className="flex justify-end">
          <div className="button-group">
            <Button className="link" onClick={this.cancelForgotPassword}>
              Back to login
            </Button>
            <Button
              className="primary"
              isLoading={this.state.isResettingPassword}
              onClick={this.sendResetLink}
            >
              Reset
            </Button>
          </div>
        </div>
      </div>
    )
  }

  renderErrors(errors) {
    return (
      <Downfade className="text-small text-error">
        {errors.map((err, idx) => (
          <div className="flex align-center" key={idx}>
            <MdReportProblem className="icon margin-right" />
            {err}
          </div>
        ))}
      </Downfade>
    )
  }
}

let mapStateToProps = state => {
  return {
    session: state.session,
  }
}

export default connect(mapStateToProps)(Login)
