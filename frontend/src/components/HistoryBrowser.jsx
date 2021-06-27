import React from 'react';
import AreaChart from './AreaChart'
import Button from './BaseButton';
import LoadingOrError from './LoadingOrError';
const d3 = require('d3-array'); 


class HistoryBrowser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            history: null,
            from: new Date(2019, 1, 1),
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
            var lineDict = {"id": category};
            var lineData = [];
            for (const [x, y] of Object.entries(catData)) {
                lineData.push({"x": this.convertTimestamp(parseInt(x)), "y": y})
            }
            lineDict["data"] = lineData;
            newData.push(lineDict);
        }
        return newData;
    }

    componentDidMount() {
        this.loadFromAPI()
    }

    loadFromAPI() {
        const fromStr = this.state.from === "earliest" ? "earliest" : this.dateISO(this.state.from);
        fetch(this.props.apiURL + `?start=${fromStr}&end=${this.dateISO(this.state.to)}`)
        .then(res => res.json())
        .then(
        (result) => {
            this.setState({
            isLoaded: true,
            history: this.reshapeData(result),
            });
        },

        (error) => {
            this.setState({
            isLoaded: true,
            error
            })
        }
        )
    }

    changeFromDate(daysAgo, activeName){
        if (daysAgo === null) {
            this.setState({
                from: "earliest",
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

    truncateData(data, truncationIndex){
        return data.map(
            (curve) => ({
                id: curve["id"],
                data: curve["data"].slice(truncationIndex),
                })
        )
    }

    getShownData() {
        var data;
        const history = this.state.history;
        if (this.state.from != "earliest") {
            const truncationIndex = d3.bisectLeft(history[0]["data"].map(e => e.x), this.dateISO(this.state.from));
            data = this.truncateData(history, truncationIndex);
            console.log(this.state.from)
        }
        else {
            data = this.state.history;
        }
        return data
    }

    getButtonArray() {
        const buttonValues = [
            {name: "Month", days: 30},
            {name: "Year", days: 365},
            {name: "Max", days: null},
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

        const {error, isLoaded } = this.state;
        
        if (error || !isLoaded){
            return <LoadingOrError
                error={error}
                isLoaded={isLoaded}
            />
        }

        const data = this.getShownData();
        const buttons = this.getButtonArray();

        return (
            <div>
                <div class="h-96">
                    <AreaChart
                        data={data}
                    />
                </div>
                <div class="pb-10 flex justify-end">
                    <div class="w-1/4 flex justify-end">
                        {buttons}
                    </div>
                </div>
            </div>
        )
    }
}

export default HistoryBrowser;