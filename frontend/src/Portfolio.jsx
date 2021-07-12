import React from 'react';
import Header from "./components/Header";
import Card from "./components/Card";
import BarChart from "./portfolio/BarChart";
import HistoryBrowser from './portfolio/HistoryBrowser';
import PortfolioTable from './portfolio/PortfolioTable';
import PositionCard from './portfolio/PositionCard';

export default function Portfolio() {

  return (
    <div class="h-screen">
      <Header active="Portfolio" />
      <div class="flex justify-center">
        <div class="w-10/12">
          {/*<p class="text-5xl font-bold p-6">Your Portfolio</p>*/}
          <div class="flex justify-center">
            <div class="w-1/3">
              <Card classes="my-4 py-1 p-1" content={<PositionCard/>}/>
            </div>
            <div class="w-2/3">
              <Card content={
                <HistoryBrowser
                  apiURL="http://localhost:5000/api/portfolio/history"
                />}
                classes="px-6 my-4 ml-4"
              />
            </div>

          </div>
          <div>
            <PortfolioTable
              apiURL="http://localhost:5000/api/portfolio/snapshot/now"
            />
          </div>
          <div class="h-64 w-full">
            <BarChart />
          </div>
        </div>

      </div>
    </div>
  );
}