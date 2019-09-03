import React, { Component } from 'react';
import './App.css';
import LoginUser from './components/LoginUser/LoginUser';
import UserHomePage from './components/UserHomePage/UserHomePage';

import { Route, Redirect, Switch, withRouter, NavLink } from 'react-router-dom';

import userService from './services/user-service';


class App extends Component {

  componentDidMount() {
  }

  logOut() {
    userService.logOut()
  }

  render() {

    let routers = (
      <Switch>
        <Route path={"/user/:user"} exact component={UserHomePage} />
        <Route path={"/"} exact component={LoginUser} />
        <Redirect to='/' />
      </Switch>
    );
    if(!userService.isLoggedIn()) {
      routers = (
        <Switch>
          <Route path={"/"} exact component={LoginUser} />
          <Redirect to='/' />
        </Switch>
      );
    }

    return(
      <div className="container">
        <div className="header-wrapper">
          <h1>Unit Conversion</h1>
          {
            userService.isLoggedIn() ? <NavLink 
            to="/" 
            className="log-out-btn"
            onClick={this.logOut}>
              LogOut <i className="fa fa-sign-out-alt"> </i>
            </NavLink> : null
          }
        </div>
        <hr/>
         { routers }
      </div>
    );
  }
}

export default withRouter(App);
