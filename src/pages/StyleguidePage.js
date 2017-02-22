import React, { Component } from 'react';
import Logo from '../components/Logo';
import {} from './StyleguidePage.css';

export default class StyleguidePage extends Component {
  render() {
    return (
      <div>
        <div className='section blue'>
          <div className='container'>
            <h1 className='title text-white'>Styleguide</h1>
          </div>
        </div>
        <div className='section'>
          <div className='container'>
            <h1>Logo</h1>
            <Logo />
            <Logo small={true} />
          </div>
        </div>
        <div className='section'>
          <div className='container'>
            <h1>Headers</h1>
            <h2>Header 2</h2>
            <h3>Header 3</h3>
            <p>Paragraph text</p>
          </div>
        </div>
        <div className='section'>
          <div className='container'>
            <h1>Buttons</h1>
            <button className='button'>Button</button>
            <button className='button primary'>Button primary</button>
          </div>
        </div>
      </div>
    );
  }
}
