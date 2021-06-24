import React from 'react';
import Button from "./components/Button";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BarChart from "./components/BarChart";
import HistoryBrowser from './components/HistoryBrowser';
import PortfolioTable from './components/PortfolioTable';

export default function Portfolio() {
  return (
    <div>
      <Header active="Portfolio"/>
      <div class="flex justify-center">
        <div class="w-10/12">
          <p class="text-5xl font-bold p-6">Your Portfolio</p>
            <div class="h-96 flex justify-center items-center">
                <HistoryBrowser
                  apiURL= "http://localhost:5000/api/portfolio/history"
                />
            </div>
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