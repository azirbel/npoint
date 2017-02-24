import React, { Component } from 'react'
import User from '../models/User'
import Header from '../components/Header'
import {} from './AccountPage.css'

export default class AccountPage extends Component {
  state = {
    name: '',
    email: '',
    avatarUrl: '',
  }

  componentDidMount() {
    User.me().then((response) => {
      this.setState({
        name: response.data.name,
        email: response.data.email,
        avatarUrl: response.data.avatar_url,
      })
    })
  }

  render() {
    return (
      <div className='account-page'>
        <Header title='Account' />
        <div className='container'>
          <div className='account-info'>
            <p>
              Name: {this.state.name}
              <br/>
              Email: {this.state.email}
            </p>
            <div className='flex align-center'>
              <img className='avatar'
                alt={this.state.name}
                src={this.state.avatarUrl}
              />
              <div>
                &nbsp;&nbsp;Image is from&nbsp;
                <a href='http://en.gravatar.com/'>Gravatar</a>.
              </div>
            </div>
            <p>
              You can't edit your profile or reset your password yet -
              sorry. For support, please contact&nbsp;
              <a href='mailto:alexzirbel+npoint@gmail.com'>
                alexzirbel+devnull@gmail.com
              </a>.
            </p>
          </div>
        </div>
      </div>
    );
  }
}
