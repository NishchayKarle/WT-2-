import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {Route, BrowserRouter} from 'react-router-dom';
import Login from './components/login'
import {CookiesProvider} from 'react-cookie';
import Symptoms from './components/symptoms';


const routing = (
  <BrowserRouter>
    <CookiesProvider>
      <Route exact path="/" component={Login} />
      <Route exact path="/medicines" component={App} />
      <Route exact path="/symptoms" component={Symptoms} />
    </CookiesProvider>
    
  </BrowserRouter>
)


ReactDOM.render(routing,document.getElementById('root'));
serviceWorker.unregister();
