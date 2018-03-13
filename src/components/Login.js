import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux'
import User from '../models/User'
import Session from '../models/Session'
import { logIn } from '../actions'
import { Tabs, Tab } from '../components/Tabs'
import Input from './Input'
import {} from './Login.css'

class Login extends Component {
  static propTypes = {
    onLogin: PropTypes.func.isRequired
  };

  state = {
    tab: 'log-in',
    name: '',
    email: '',
    password: '',
  }

  handleSignup(e) {
    let { dispatch } = this.props
    User.create({
      name: this.state.name,
      email: this.state.email,
      password: this.state.password,
      password_confirmation: this.state.password,
    }).then((response) => {
      let { name, email, avatar_url } = response.data
      dispatch(logIn({ name, email, avatar_url }))
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
      let { name, email, avatar_url } = response.data
      dispatch(logIn({ name, email, avatar_url }))
      this.props.onLogin()
    })
    e.preventDefault();
  }

  render() {
    return (
      <div className='login-component'>
        <Tabs
          fullWidth={true}
          onChange={tab => this.setState({ tab })}
          initialValue='log-in'
        >
          <Tab value='log-in'>Log in</Tab>
          <Tab value='sign-up'>Sign up</Tab>
        </Tabs>
        {this.state.tab === 'log-in' ? (
          <form className='form padded' onSubmit={(e) => this.handleLogin(e)}>
            <Input
              label='Email'
              type='email'
              value={this.state.email}
              onChange={(email) => this.setState({ email })}
            />
            <Input
              label='Password'
              type='password'
              value={this.state.password}
              onChange={(password) => this.setState({ password })}
            />
            <div className='flex justify-end'>
              <button className='button primary' type='submit'>Log in</button>
            </div>
          </form>
        ) : (
          <form className='form padded' onSubmit={(e) => this.handleSignup(e)}>
            <Input
              label='Name'
              value={this.state.name}
              onChange={(name) => this.setState({ name })}
            />
            <Input
              label='Email'
              type='email'
              value={this.state.email}
              onChange={(email) => this.setState({ email })}
            />
            <Input
              label='Password'
              type='password'
              value={this.state.password}
              onChange={(password) => this.setState({ password })}
            />
            <div className='flex justify-end'>
              <button className='button primary' type='submit'>Sign up</button>
            </div>
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
