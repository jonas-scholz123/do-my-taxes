import React, { useState } from 'react';
import Header from "./components/Header";
import HistoryBrowser from './portfolio/HistoryBrowser';
import PositionCards from './portfolio/PositionCards'
import withApiWrapper from './components/ApiWrapper';

export default function Portfolio(props) {

  const portfolioUrl = "http://localhost:5000/api/portfolio/history"

  const [dataSource, setDataSource] = useState(portfolioUrl)

  // these are the tailwind indigo shades 100, 300, 400, 500, 600, 700
  const colors = dataSource !== portfolioUrl
      ? ['#6366F1', '#E0E7FF']
      : ['#E0E7FF', '#A5B4FC', '#818CF8', '#6366F1', '#4338CA', '#4F46E5', '#312E81']

  const EnhancedHistoryBrowser = withApiWrapper(HistoryBrowser, dataSource)

  return (
    <div>
      <Header active="Portfolio" />
      <div className="h-screen grid grid-cols-12 gap-5 p-5">
        <div className="col-span-4 overflow-scroll border rounded-lg shadow-lg ">
          <PositionCards setDataSource={(apiUrl) => setDataSource(apiUrl)}/>
        </div>
        <div className="col-span-8 overflow-scroll border rounded-lg shadow-lg">
          <div className="p-4 bg-white h-full">
            <h1 className="text-3xl font-bold pb-3"> Portfolio History </h1>
            <EnhancedHistoryBrowser colors={colors}/>
          </div>
        </div>
      </div>
    </div>
  );
}