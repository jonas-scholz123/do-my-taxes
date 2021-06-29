import React from 'react';
import Transactions from "./Transactions";
import Portfolio from "./Portfolio";

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <div>
        <Switch>
          <Route path="/transactions">
            <Transactions />
          </Route>

          <Route path="/portfolio">
            <Portfolio />
          </Route>

        </Switch>
      </div>
    </Router>
  );
}

export default App;
