import React from 'react';
import Header from "./components/Header";
import HistoryBrowser from './portfolio/HistoryBrowser';
import PositionCards from './portfolio/PositionCards'

export default function Portfolio(props) {
  return (
    <div>
      <Header active="Portfolio" />
      <div class="h-screen grid grid-cols-12 gap-5 p-5">
        <div class="col-span-4 overflow-scroll border rounded-lg shadow-lg ">
          <PositionCards/>
        </div>
        <div class="col-span-8 overflow-scroll border rounded-lg shadow-lg">
          <div class="p-4 bg-white h-full">
            <h1 class="text-3xl font-bold pb-3"> Portfolio History </h1>
            <HistoryBrowser
              apiURL="http://localhost:5000/api/portfolio/history"
            />
          </div>
        </div>
      </div>
    </div>
  );
}