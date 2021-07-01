import React from 'react';
import Header from "./components/Header";
import BarChart from "./portfolio/BarChart";
import HistoryBrowser from './portfolio/HistoryBrowser';
import PortfolioTable from './portfolio/PortfolioTable';

export default function Portfolio() {
  return (
    <div>
      <Header active="Portfolio"/>
      <div class="flex justify-center">
        <div class="w-10/12">
          <p class="text-5xl font-bold p-6">Your Portfolio</p>
                <HistoryBrowser
                  apiURL= "http://localhost:5000/api/portfolio/history"
                />
            <div>
                <PortfolioTable
                  apiURL="http://localhost:5000/api/portfolio/snapshot/now"
                />
            </div>
            <div class="h-64 w-full">
                <BarChart/>
            </div>
        </div>
      </div>
    </div>
  );
}