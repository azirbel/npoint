// @format

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from '../../components/Button'

export default class SchemaPlaceholder extends Component {
  static propTypes = {
    onGenerate: PropTypes.func.isRequired,
  }

  render() {
    return (
      <div className="button-group animated-button-container">
        <Button
          className="small"
          onClick={this.props.onGenerate}
        >
          Generate schema
        </Button>
      </div>
    )
  }
}
