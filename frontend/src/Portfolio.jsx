import React from 'react';
import Button from "./components/Button";
import Header from "./components/Header";
import Footer from "./components/Footer";
import BarChart from "./components/BarChart";
import AreaChart from './components/AreaChart';

export default function Portfolio() {
  return (
    <div>
      <Header active="Portfolio"/>
      <div class="flex justify-center">
        <div class="w-10/12">
          <p class="text-5xl font-bold p-6">Your Portfolio</p>

            <div class="h-96 w-full">
                <AreaChart
                  apiURL= "http://localhost:5000/api/portfolio/history"
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