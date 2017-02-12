import React, { Component } from 'react'
import User from '../models/User'
import Input from '../components/Input'
import Header from '../components/Header'
import {} from './AccountPage.css'

export default class AccountPage extends Component {
  state = {
    name: '',
    email: '',
    gravatarUrl: '',
  }

  componentDidMount() {
    User.get(1).then((response) => {
      this.setState({
        name: response.data.name,
        email: response.data.email,
        gravatarUrl: response.data.gravatar_url,
      })
    })
  }

  render() {
    return (
      <div>
        <Header title='Account' />
        <div className='container'>
          <img className='avatar'
            alt={this.state.name}
            src={this.state.gravatarUrl}
          />
          <Input
            label='Name'
            value={this.state.name}
            onChange={(name) => this.setState({ name })}
          />
          <Input
            label='Email'
            value={this.state.email}
            onChange={(email) => this.setState({ email })}
          />
        </div>
      </div>
    );
  }
}
