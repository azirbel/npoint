import React, { Component } from 'react'
import { connect } from 'react-redux'
import User from '../models/User'
import Header from '../components/Header'
import Input from '../components/Input'
import { push } from 'react-router-redux'
import { MdDone, MdEdit } from 'react-icons/lib/md'
import {} from './AccountPage.css'

class AccountPage extends Component {
  state = {
    name: '',
    email: '',
    avatarUrl: '',
    isEditingName: false,
    resetPasswordEmailSent: false,
  }

  componentDidMount() {
    User.me().then((response) => {
      if (!response.data.email) {
        this.props.dispatch(push('/'))
        return;
      }

      this.setState({
        name: response.data.name,
        email: response.data.email,
        avatarUrl: response.data.avatar_url,
      })
    })
  }

  saveNewName = () => {
    User.update({
      name: this.state.name,
    }).then(() => {
      this.setState({ isEditingName: false });
    })
  }

  sendPasswordResetEmail = () => {
    User.sendResetPasswordEmail({ email: this.state.email }).then(() => {
      this.setState({ resetPasswordEmailSent: true });

      setTimeout(() => {
        this.setState({ resetPasswordEmailSent: false });
      }, 20000);
    });
  }

  handleKeyPress(e) {
    if (e.key === 'Enter') {
      this.saveNewName()
    }
  }

  render() {
    return (
      <div className='account-page'>
        <Header>
          <h1 className='page-title'>Account</h1>
          <div className='flex-spring'></div>
        </Header>
        <div className='container'>
          <div className='account-info'>
            <div className='account-info-section'>
              <h5>Name</h5>
              {this.renderEditableName()}
            </div>
            <div className='account-info-section'>
              <h5>Email</h5>
              {this.state.email}
            </div>
            <div className='account-info-section'>
              <h5>Avatar</h5>
              <img className='avatar'
                alt={this.state.name}
                src={this.state.avatarUrl}
              />
              <div>
                Image is from&nbsp;
                <a href='http://en.gravatar.com/'>Gravatar</a>.
              </div>
            </div>
            <div className='account-info-section'>
              <h5>Password</h5>
              <button
                className='button'
                onClick={this.sendPasswordResetEmail}
              >
                Send a password reset email
              </button>
              {this.state.resetPasswordEmailSent && (
                <div className='text-green'>Sent! Check your email to set a new password.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  renderEditableName() {
    return this.state.isEditingName ? (
      <div className='flex align-center'>
        <Input
          value={this.state.name}
          onKeyPress={(e) => this.handleKeyPress(e)}
          onChange={(e) => this.setState({ name: e.target.value })}
        />
        <button
          className='button link square edit-name-button'
          onClick={this.saveNewName}
        >
          <MdDone/>
        </button>
      </div>
    ) : (
      <div className='flex align-center'>
        <span>{this.state.name}&nbsp;</span>
        <button
          className='button link square edit-name-button'
          onClick={() => this.setState({ isEditingName: true })}
        >
          <MdEdit/>
        </button>
      </div>
    )
  }
}

export default connect()(AccountPage)
