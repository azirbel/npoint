// @format

import React, { Component } from 'react'
import {} from './Footer.css'

export default class Footer extends Component {
  render() {
    return (
      <footer className="footer">
        <div className="section blue">
          <div className="container">
            <div className="text-white text-center">n:point &copy; 2018</div>
            <div className="text-white text-center">
              Made by{' '}
              <a target="_blank" href="https://twitter.com/alexzirbel">
                Alex Zirbel
              </a>{' '}
              · Code on{' '}
              <a target="_blank" href="https://github.com/azirbel/npoint">
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    )
  }
}
