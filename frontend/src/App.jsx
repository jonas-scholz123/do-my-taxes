import React from 'react';
import Transactions from "./Transactions";
import SingleTransaction from './SingleTransaction';
import Portfolio from "./Portfolio";
import PortfolioNew from "./Portfolio copy";

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
          <Route path="/portfolio2" element={<PortfolioNew />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
