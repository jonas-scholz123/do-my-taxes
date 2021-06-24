import React from 'react';
import AreaChart from './AreaChart'
import ClipLoader from "react-spinners/ClipLoader";

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class HistoryBrowser extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            history: null,
        }
    }

    convertTimestamp(timestamp) {
        return new Date(timestamp).toISOString().substring(0, 10);
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

    async componentDidMount() {
        fetch(this.props.apiURL + "?start=2019-04-01&end=2021-06-01")
        .then(res => res.json())
        .then(
        (result) => {
            this.setState({
            isLoaded: true,
            history: result,
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

    render() {

        const {error, isLoaded, history } = this.state;

        if (error) {
        return <div> Error; {error.message} </div>;
        } else if (!isLoaded) {
            return (
                <div class="flex justify-center items-center">
                    <ClipLoader loading={!isLoaded} size={150} />
                </div>
            )
        }

        const data = this.reshapeData(history);

        return (
            <AreaChart
              data={data}
            />
        )
    }
}

export default HistoryBrowser;