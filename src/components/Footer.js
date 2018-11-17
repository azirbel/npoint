import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router'

import {} from './Footer.css'

export default class Footer extends Component {
  static propTypes = {
    light: PropTypes.bool,
  }

  render() {
    let sectionClassName = `section ${
      this.props.light ? ' dark-white less-padding' : ' blue'
    }`

    return (
      <footer className="footer">
        <div className={sectionClassName}>
          <div className="container hidden-sm-up text-center">
            <div className="footer-line-xs">n:point &copy; 2018</div>
            <div className="footer-line-xs">
              Made by{' '}
              <a target="_blank" href="https://twitter.com/alexzirbel">
                Alex Zirbel
              </a>{' '}
              · Code on{' '}
              <a target="_blank" href="https://github.com/azirbel/npoint">
                GitHub
              </a>
            </div>
            <br />
            <div className="footer-line-xs">
              <Link to="/faq">Frequently Asked Questions</Link>
            </div>
            <div className="footer-line-xs">
              More questions?{' '}
              <a href="mailto:support@npoint.io">support@npoint.io</a>
            </div>
          </div>
          <div className="container hidden-xs-down">
            <div className="row">
              <div className="col-xs-6">
                <div className="footer-line-1">n:point &copy; 2018</div>
                <div>
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
              <div className="col-xs-6 text-right">
                <div className="footer-line-1">
                  <Link to="/faq">Frequently Asked Questions</Link>
                </div>
                <div>
                  More questions?{' '}
                  <a href="mailto:support@npoint.io">support@npoint.io</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    )
  }
}
