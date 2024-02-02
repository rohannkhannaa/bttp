import React from 'react';
import Login from "./login.component";
import ReactDOM from 'react-dom';
import './index.css';
import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Router, Switch, Route, Redirect } from 'react-router-dom';
import history from './history';
import RegisterAgency from "./RegisterAgency";
import RegisterShq from "./RegisterShq";
import AdminLayout from "./layouts/Admin/Admin";
import Adminn from "./layouts/Admin/Adminn";
import Shq from "./layouts/Admin/Shq";
import "./assets/scss/black-dashboard-react.scss";
import "./assets/demo/demo.css";
import "./assets/css/nucleo-icons.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import ThemeContextWrapper from "./components/ThemeWrapper/ThemeWrapper";
import BackgroundColorWrapper from "./components/BackgroundColorWrapper/BackgroundColorWrapper";

ReactDOM.render(
  <ThemeContextWrapper>
    <BackgroundColorWrapper>
      <Router history={history}>
        <Switch>
          <Route exact path='/' component={Login} />
          <Route path="/RegisterAgency" component={RegisterAgency} />
          <Route path="/RegisterShq" component={RegisterShq} />
          <Route path="/admin" render={(props) => <AdminLayout {...props} />} />
          <Route path="/Adminn" render={(props) => <Adminn {...props} />} />
          <Route path="/Shq" render={(props) => <Shq {...props} />} />

        </Switch>
      </Router>
    </BackgroundColorWrapper>
  </ThemeContextWrapper>,
  document.getElementById('root')
);

reportWebVitals();
