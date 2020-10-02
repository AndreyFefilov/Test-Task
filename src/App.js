import React from 'react';
import './App.scss';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import ProtectedRoute from "./components/Protected.route";

function App() {

    return (
      <>
        <Router>
          <Switch>
            <Route exact path="/login" component={Login}/>
            <ProtectedRoute exact path="/" component={Home}/>
            <Route path="*" render = {() =>
            <h1 style={{color: '#990000', textAlign: 'center'}}>
              404 Not Found
            </h1>} />
          </Switch>
        </Router>
      </>
    );
}

export default App;
