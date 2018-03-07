import React, { Component } from "react";
import { connect } from "react-redux";
import {} from "./Header.css";
import Logo from "./Logo";
import { Link } from "react-router";
import LoginDropdown from "./header/LoginDropdown";
import AccountDropdown from "./header/AccountDropdown";
import Document from "../models/Document";
import { push } from "react-router-redux";

class Header extends Component {
  createDocument() {
    let { dispatch } = this.props;
    Document.create({ generate_contents: true }).then(response => {
      dispatch(push(`/docs/${response.data.token}`));
    });
  }

  render() {
    return (
      <div>
        <header className="header">
          <div
            className={
              "container header-container" +
              (this.props.children ? " small-logo" : "")
            }
          >
            {this.renderTitle()}
            <div className="flex header-spaced-out">
              <button
                className="button primary"
                onClick={() => this.createDocument()}
              >
                + New
              </button>
              {this.props.session.loggedIn ? (
                <AccountDropdown />
              ) : (
                <LoginDropdown />
              )}
            </div>
          </div>
        </header>
        <div className="header-spacer" />
      </div>
    );
  }

  renderTitle() {
    return (
      <div>
        {this.props.children ? (
          <div className="flex align-center">
            <Link href="/" className="unstyled">
              <div className="small-logo-container">
                <Logo small={true} />
              </div>
            </Link>
            {this.props.children}
          </div>
        ) : (
          <Logo />
        )}
      </div>
    );
  }
}

let mapStateToProps = state => {
  return {
    session: state.session
  };
};

export default connect(mapStateToProps)(Header);
