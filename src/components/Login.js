import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux'
import User from '../models/User'
import Session from '../models/Session'
import { logIn } from '../actions'
import {} from './Login.css'

class Login extends Component {
  static propTypes = {
    onLogin: PropTypes.func.isRequired
  };

  state = {
    loginTab: true,
    name: '',
    email: '',
    password: '',
  }

  handleSignup(e) {
    User.create({
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password_confirmation: this.state.password,
    }).then(() => {
      this.props.onLogin()
    })
    e.preventDefault();
  }

  handleLogin(e) {
    let { dispatch } = this.props
    Session.login({
      email: this.state.email,
      password: this.state.password,
    }).then((response) => {
      let { name, email } = response.data
      dispatch(logIn({ name, email }))
      this.props.onLogin()
    })
    e.preventDefault();
  }

  render() {
    return (
      <div>
        <div>
          <button className='button link' onClick={() => this.setState({ loginTab: true, })}>
            Log in
          </button>
          <button className='button link' onClick={() => this.setState({ loginTab: false, })}>
            Sign up
          </button>
        </div>
        {this.state.loginTab ? (
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
        ) : (
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
        )}
      </div>
    )
  }
}

let mapStateToProps = (state) => {
  return {
    session: state.session
  }
}

export default connect(mapStateToProps)(Login)
