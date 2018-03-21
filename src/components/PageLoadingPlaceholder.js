// @format

import React, { Component } from 'react'
import LoadingSpinner from './LoadingSpinner'
import {} from './PageLoadingPlaceholder.css'

export default class PageLoadingPlaceholder extends Component {
  render() {
    return (
      <div className="page-loading-placeholder">
        <LoadingSpinner />
      </div>
    )
  }
}
