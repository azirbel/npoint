// @format

import React, { Component } from 'react'
import { connect } from 'react-redux'
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
  }

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
      avatarUrl: userData.avatar_url,
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
    this.setState({ isResettingPassword: true })
    User.sendResetPasswordEmail({ email: this.state.email }).then(() => {
      this.setState({
        isResettingPassword: false,
        resetPasswordEmailSent: true
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
                <a href="http://en.gravatar.com/">Gravatar</a>.
              </div>
            </div>
            <div className="account-info-section prose">
              <h5>Password</h5>
              <Button isLoading={this.state.isResettingPassword} onClick={this.sendPasswordResetEmail}>
                Send a password reset email
              </Button>
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
