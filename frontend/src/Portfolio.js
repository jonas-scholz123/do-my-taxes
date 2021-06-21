import React from 'react';
import Button from "./components/Button.js";
import Header from "./components/Header.js";
import Footer from "./components/Footer.js";
import BarChart from "./components/BarChart.js";
import PieChart from "./components/PieChart.js";

const pieData = [
    {
      "id": "ETFs",
      "label": "ETFs",
      "value": 80,
      "color": "hsl(39, 70%, 50%)"
    },
    {
      "id": "stocks",
      "label": "stocks",
      "value": 12,
      "color": "hsl(105, 70%, 50%)"
    },
    {
      "id": "cash",
      "label": "cash",
      "value": 6,
      "color": "hsl(330, 70%, 50%)"
    },
    {
      "id": "bets",
      "label": "bets",
      "value": 2,
      "color": "hsl(92, 70%, 50%)"
    },
  ]

export default function Portfolio() {
  return (
    <div>
      <Header active="Portfolio"/>
      <div class="flex justify-center">
        <div class="w-10/12">
          <p class="text-5xl font-bold p-6">Your Portfolio</p>
            <div class="h-64 w-full">
                <BarChart/>
            </div>

            <div class="h-64 w-1/3">
                <PieChart
                data={pieData}
                />
          </div>
        </div>
      </div>
    </div>
  );
}