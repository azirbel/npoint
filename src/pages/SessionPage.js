import React, { Component } from 'react'
import User from '../models/User'
import Session from '../models/Session'
import Header from '../components/Header'
import {} from './SessionPage.css'

export default class SessionPage extends Component {
  state = {
    name: '',
    email: '',
    password: '',
    userInfo: {},
  }

  handleSignup(e) {
    console.log('Signup');
    User.create({
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password_confirmation: this.state.password,
    }).then(() => {
      console.log('Success!')
    })
    e.preventDefault();
  }

  handleLogin(e) {
    console.log('Login');
    Session.login({
      email: this.state.email,
      password: this.state.password,
    }).then(() => {
      console.log('Success!')
    })
    e.preventDefault();
  }

  logOut() {
    Session.logout()
  }

  getUserInfo() {
    User.get(1).then((response) => {
      this.setState({ userInfo: response.data })
    })
  }

  render() {
    return (
      <div>
        <Header title="Session" />
        <div className='container'>
          <h1>Sign up</h1>
          <form onSubmit={(e) => this.handleSignup(e)}>
            <label>
              Name
              <input value={this.state.name} onChange={(e) => this.setState({ name: e.target.value })} />
            </label>
            <label>
              Email
              <input value={this.state.email} onChange={(e) => this.setState({ email: e.target.value })} />
            </label>
            <label>
              Password
              <input value={this.state.password} onChange={(e) => this.setState({ password: e.target.value })} />
            </label>
            <input type='submit' value='Submit' />
          </form>

          <h1>Log In</h1>
          <form onSubmit={(e) => this.handleLogin(e)}>
            <label>
              Email
              <input value={this.state.email} onChange={(e) => this.setState({ email: e.target.value })} />
            </label>
            <label>
              Password
              <input value={this.state.password} onChange={(e) => this.setState({ password: e.target.value })} />
            </label>
            <input type='submit' value='Submit' />
          </form>

          <h1>Log Out</h1>
          <button onClick={() => this.logOut()}>Log Out</button>

          <h1>Current User Info</h1>
          <div>{JSON.stringify(this.state.userInfo)}</div>
          <button onClick={() => this.getUserInfo()}>Get</button>
        </div>
      </div>
    );
  }
}
