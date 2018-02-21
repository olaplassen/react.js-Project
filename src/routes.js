import React from 'react';
import { Link, HashRouter, Switch, Route } from 'react-router-dom';


import  Menu from './app.js';
import Registration from './registration.js';

export default (
  <Route path="/" component={App}>
    <IndexRoute component={MainPage} />
    <Route path="/some/where" component={SomePage} />
    <Route path="/some/otherpage" component={SomeOtherPage} />
  </Route>
);
