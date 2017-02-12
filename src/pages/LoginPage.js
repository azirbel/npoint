import React, { Component } from 'react'
import User from '../models/User'
import Header from '../components/Header'
import {} from './LoginPage.css'

export default class LoginPage extends Component {
  state = {
    name: '',
    email: '',
    password: '',
  }

  handleSubmit(e) {
    console.log(this.state.name);
    User.create({
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password_confirmation: this.state.password,
    })
    e.preventDefault();
  }

  render() {
    return (
      <div>
        <Header title="Log In" />
        <div className='container'>
          <form onSubmit={(e) => this.handleSubmit(e)}>
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
        </div>
      </div>
    );
  }
}
