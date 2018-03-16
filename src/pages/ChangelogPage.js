/* global axios */

import React, { Component } from 'react'
import Header from '../components/Header'

export default class ChangelogPage extends Component {
  state = {
    changes: [],
  }

  componentDidMount() {
    axios.get('https://api.npoint.io/changelog').then(response => {
      this.setState({ changes: response.data })
    })
  }

  render() {
    return (
      <div className="changelog-page">
        <Header>
          <h1 className="page-title">Changelog</h1>
        </Header>
        <div className="section">
          <div className="container">
            {this.state.changes.map(change => (
              <div key={change.date}>
                <h3>{change.date}</h3>
                <ul className="ul">
                  {change.description.map(item => {
                    return <li key={item}>{item}</li>
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }
}
