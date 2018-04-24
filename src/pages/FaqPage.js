// @format

/* global axios */

import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import ReactMarkdown from 'react-markdown'
import _ from 'lodash'

import Header from '../components/Header'
import Footer from '../components/Footer'
import PageLoadingPlaceholder from '../components/PageLoadingPlaceholder'

import {} from './FaqPage.css'

class Faq extends Component {
  render() {
    return (
      <div className="faq prose">
        <h3>{this.props.question}</h3>
        <ReactMarkdown source={this.props.answer} />
      </div>
    )
  }
}

export default class FaqPage extends Component {
  state = {
    faqs: [],
  }

  componentDidMount() {
    axios.get('https://api.npoint.io/faq').then(response => {
      this.setState({ faqs: response.data })
    })
  }

  render() {
    return (
      <div className="faq-page page">
        <Header>
          <h1 className="page-title hidden-xs-down">Frequently Asked Questions</h1>
          <h1 className="page-title hidden-sm-up">FAQ</h1>
          <div className="flex-spring" />
        </Header>
        <Helmet>
          <title>Frequently Asked Questions</title>
        </Helmet>
        {_.isEmpty(this.state.faqs) ? (
          <PageLoadingPlaceholder />
        ) : (
          <div className="container main-body">
            {this.state.faqs.map(faq => (
              <Faq
                key={faq.question}
                question={faq.question}
                answer={faq.answer}
              />
            ))}
          </div>
        )}

        <div className="flex-spring" />
        <Footer light={true} />
      </div>
    )
  }
}
