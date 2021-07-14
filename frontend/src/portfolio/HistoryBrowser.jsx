import React from 'react';
import AreaChart from './AreaChart'
import Button from '../components/BaseButton';
import withApiWrapper from '../components/ApiWrapper';

const d3 = require('d3-array');


class HistoryBrowser extends React.Component {

  constructor(props) {
    // extract earliest date from data
    const earliestDateMs = parseInt(Object.keys(Object.values(props.data)[0])[0])
    const earliestDate = new Date(earliestDateMs)

    super(props);
    this.state = {
      earliest: earliestDate,
      from: earliestDate,
      to: new Date(),
      nrItems: 100,
      activeButton: "Max",
    }
  }

  convertTimestamp(timestamp) {
    return new Date(timestamp).toISOString().substring(0, 10);
  }

  dateISO(date) {
    return date.toISOString().substring(0, 10)
  }

  reshapeData(data) {
    var newData = [];
    for (const [category, catData] of Object.entries(data)) {
      var lineDict = { "id": category };
      var lineData = [];
      for (const [x, y] of Object.entries(catData)) {
        lineData.push({ "x": this.convertTimestamp(parseInt(x)), "y": y })
      }
      lineDict["data"] = lineData;
      newData.push(lineDict);
    }
    return newData;
  }

  changeFromDate(daysAgo, activeName) {
    if (daysAgo === null) {
      this.setState({
        from: this.state.earliest,
        activeButton: activeName,
      })
      return
    }
    var from = new Date();
    from.setDate(from.getDate() - daysAgo)
    // reload
    this.setState({
      from: from,
      activeButton: activeName,
    })
  }

  truncateData(data, truncationIndex) {
    return data.map(
      (curve) => ({
        id: curve["id"],
        data: curve["data"].slice(truncationIndex),
      })
    )
  }

  getShownData() {
    var data;
    const history = this.reshapeData(this.props.data);
    const truncationIndex = d3.bisectLeft(history[0]["data"].map(e => e.x), this.dateISO(this.state.from));
    data = this.truncateData(history, truncationIndex);
    return data
  }

  getButtonArray() {
    const buttonValues = [
      { name: "Month", days: 30 },
      { name: "Year", days: 365 },
      { name: "Max", days: null },
    ]

    return buttonValues.map(
      (val) =>
        <Button
          text={val.name}
          handleClick={() => (this.changeFromDate(val.days, val.name))}
          active={val.name === this.state.activeButton}
          activeClasses="border-indigo-700 "
        />
    )
  }

  render() {

    const data = this.getShownData();
    const buttons = this.getButtonArray();

    return (
      <div class="h-4/5">
        <div class="h-full">
          <AreaChart
            data={data}
          />
        </div>
        <div class="flex justify-end">
          <div class="w-1/4 flex justify-end">
            {buttons}
          </div>
        </div>
      </div>
    )
  }
}

export default withApiWrapper(HistoryBrowser, "http://localhost:5000/api/portfolio/history");