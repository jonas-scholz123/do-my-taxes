import React from 'react';
import Transactions from "./Transactions";
import SingleTransaction from './SingleTransaction';
import Portfolio from "./Portfolio";

import {
  BrowserRouter,
  Route,
  Routes,
} from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <div>
        <Routes>
          <Route path="/transactions">
            <Route path="/" element={<Transactions />} />
            <Route path="/:transactionId" element={<SingleTransaction />} />

          </Route>

          <Route path="/portfolio" element={<Portfolio />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
