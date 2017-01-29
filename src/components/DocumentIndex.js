import React, { Component } from 'react';
import { Link } from 'react-router'

class DocumentIndex extends Component {
  render() {
    return (
      <div className="container">
        <h1>All Documents</h1>

        <ul>
          <li>
            <Link to={`/edit/1`}>Document 1</Link>
          </li>
        </ul>
      </div>
    );
  }
}

export default DocumentIndex;
