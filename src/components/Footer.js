// @format

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {} from './Footer.css'

export default class Footer extends Component {
  static propTypes = {
    light: PropTypes.bool,
  }

  render() {
    let sectionClassName = `section ${this.props.light ? ' dark-white less-padding' : ' blue'}`

    return (
      <footer className="footer">
        <div className={sectionClassName}>
          <div className="container">
            <div className="text-center footer-line-1">n:point &copy; 2018</div>
            <div className="text-center">
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
