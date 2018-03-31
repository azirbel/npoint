// @format

import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Helmet } from 'react-helmet'
import { push } from 'react-router-redux'

import Button from '../components/Button'
import ClickToEdit from '../components/ClickToEdit'
import Header from '../components/Header'
import PageLoadingPlaceholder from '../components/PageLoadingPlaceholder'
import User from '../models/User'
import createNewDocument from '../helpers/createNewDocument'
import { logIn } from '../actions'

import {} from './AccountPage.css'

class AccountPage extends Component {
  state = {
    isSavingName: false,
    isResettingPassword: false,
    resetPasswordEmailSent: false,
    errorResettingPassword: '',
  }

  componentDidMount() {
    this.maybeRedirectToHomepage(this.props)
  }

  componentWillReceiveProps(newProps) {
    this.maybeRedirectToHomepage(newProps)
  }

  maybeRedirectToHomepage(props) {
    if (props.session.loaded && !props.session.loggedIn) {
      this.props.dispatch(push('/'))
    }
  }

  saveNewName = newName => {
    this.setState({ isSavingName: true })
    User.update({
      name: newName,
    }).then(({ data }) => {
      this.props.dispatch(logIn(data))
      this.setState({ isSavingName: false })
    })
  }

  sendPasswordResetEmail = () => {
    this.setState({
      isResettingPassword: true,
      errorResettingPassword: false,
      resetPasswordEmailSent: false,
    })
    User.sendResetPasswordEmail({ email: this.props.session.user.email })
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
          <Button onClick={() => createNewDocument(this.props.router)}>
            + New Document
          </Button>
        </Header>
        <Helmet>
          <title>Account</title>
        </Helmet>
        {this.props.session.loaded ? (
          this.renderMain()
        ) : (
          <PageLoadingPlaceholder />
        )}
      </div>
    )
  }

  renderMain() {
    if (!this.props.session.loggedIn) {
      return <div />
    }

    return (
      <div className="container">
        <div className="account-info">
          <div className="account-info-section">
            <h5>Name</h5>
            <ClickToEdit
              value={this.props.session.user.name}
              onChange={this.saveNewName}
              isLoading={this.state.isSavingName}
            />
          </div>
          <div className="account-info-section prose">
            <h5>Email</h5>
            {this.props.session.user.email}
          </div>
          <div className="account-info-section prose">
            <h5>Avatar</h5>
            <img
              className="avatar"
              role="presentation"
              src={this.props.session.user.avatarUrl}
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
                Could not send an email to {this.props.session.user.email}.
                Please try again later.
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
    )
  }
}

let mapStateToProps = state => {
  return {
    session: state.session,
  }
}

export default connect(mapStateToProps)(AccountPage)
