/* global axios */

import React, { Component } from 'react'
import Header from '../components/Header'
import {} from './FaqPage.css'

class Faq extends Component {
  render() {
    return (
      <div className='faq'>
        <h3>{this.props.question}</h3>
        <p>{this.props.answer}</p>
      </div>
    )
  }
}

export default class FaqPage extends Component {
  state = {
    faqs: []
  }

  componentDidMount() {
    axios.get('http://api.npoint.io/faq').then((response) => {
      this.setState({ faqs: response.data })
    })
  }

  render() {
    return (
      <div className='faq-page'>
        <Header title='Frequently Asked Questions' />
        <div className='section'>
          <div className='container'>
            {this.state.faqs.map((faq) => (
              <Faq key={faq.question} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </div>
    );
  }
}
