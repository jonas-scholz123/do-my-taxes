import React from 'react';
import Header from "./components/Header";
import Card from "./components/Card";
import BarChart from "./portfolio/BarChart";
import HistoryBrowser from './portfolio/HistoryBrowser';
import PortfolioTable from './portfolio/PortfolioTable';
import PositionCard from './portfolio/PositionCard';

export default function Portfolio() {
  var cards = []
    for (let i = 0; i < 15; i++) {
      cards.push(<PositionCard/>)
    }

  return (
    <div>
      <Header active="Portfolio" />
      <div class="h-screen grid grid-cols-12 gap-5 p-5">
        <div class="col-span-4 overflow-scroll border rounded-lg shadow-lg ">
          <div class="grid grid-cols-1 divide-y">
            {cards}
          </div>
        </div>
        <div class="col-span-8 overflow-scroll border rounded-lg shadow-lg">
          <div class="p-6 bg-white">
            <HistoryBrowser
              apiURL="http://localhost:5000/api/portfolio/history"
            />
          </div>
        </div>
      </div>
    </div>
  );
}