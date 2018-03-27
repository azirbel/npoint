// @format

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import User from '../models/User'
import Header from '../components/Header'
import ClickToEdit from '../components/ClickToEdit'
import Button from '../components/Button'
import { push } from 'react-router-redux'
import {} from './AccountPage.css'

class AccountPage extends Component {
  state = {
    name: '',
    email: '',
    avatarUrl: '',
    isSavingName: false,
    isResettingPassword: false,
    resetPasswordEmailSent: false,
    errorResettingPassword: '',
  }

  // TODO(azirbel): Use data from the redux store
  componentDidMount() {
    User.me().then(({ data }) => {
      if (!data.email) {
        this.props.dispatch(push('/'))
        return
      }

      this.onFetchUser(data)
    })
  }

  onFetchUser = userData => {
    this.setState({
      name: userData.name,
      email: userData.email,
      avatarUrl: userData.avatarUrl,
    })
  }

  saveNewName = newName => {
    this.setState({ isSavingName: true })
    User.update({
      name: newName,
    }).then(({ data }) => {
      this.onFetchUser(data)
      this.setState({ isSavingName: false })
    })
  }

  sendPasswordResetEmail = () => {
    this.setState({
      isResettingPassword: true,
      errorResettingPassword: false,
      resetPasswordEmailSent: false,
    })
    User.sendResetPasswordEmail({ email: this.state.email })
      .then(() => {
        this.setState({
          isResettingPassword: false,
          resetPasswordEmailSent: true,
        })
      })
      .catch(error => {
        this.setState({
          errorResettingPassword: true,
          isResettingPassword: false,
        })
      })
  }

  render() {
    return (
      <div className="account-page">
        <Header>
          <h1 className="page-title">Account</h1>
          <div className="flex-spring" />
        </Header>
        <Helmet>
          <title>Account</title>
        </Helmet>
        <div className="container">
          <div className="account-info">
            <div className="account-info-section">
              <h5>Name</h5>
              <ClickToEdit
                value={this.state.name}
                onChange={this.saveNewName}
                isLoading={this.state.isSavingName}
              />
            </div>
            <div className="account-info-section prose">
              <h5>Email</h5>
              {this.state.email}
            </div>
            <div className="account-info-section prose">
              <h5>Avatar</h5>
              <img
                className="avatar"
                alt={this.state.name}
                src={this.state.avatarUrl}
              />
              <div>
                Change your image on&nbsp;
                <a target="_blank" href="http://en.gravatar.com/">
                  Gravatar
                </a>.
              </div>
            </div>
            <div className="account-info-section prose">
              <h5>Password</h5>
              <Button
                isLoading={this.state.isResettingPassword}
                onClick={this.sendPasswordResetEmail}
              >
                Send a password reset email
              </Button>
              {this.state.errorResettingPassword && (
                <div className="text-error password-reset-confirmation">
                  Could not send an email to {this.state.email}. Please try
                  again later.
                </div>
              )}
              {this.state.resetPasswordEmailSent && (
                <div className="text-success password-reset-confirmation">
                  Sent! Check your email to set a new password.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default connect()(AccountPage)
