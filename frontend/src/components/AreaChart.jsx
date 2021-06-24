import { ResponsiveLine } from '@nivo/line'
import React from 'react';
import ClipLoader from "react-spinners/ClipLoader";

class MyResponsiveLine extends React.Component { 

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

    componentDidMount() {
        fetch(this.props.apiURL + "?start=2018-01-01&end=2021-06-01")
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

        let data = this.reshapeData(history)

        return (
            <ResponsiveLine
                data={data}
                margin={{ top: 50, right: 110, bottom: 50, left: 80 }}
                xScale={{
                        type: "time",
                        format: "%Y-%m-%d"
                        }}
                xFormat="time:%Y-%m-%d"
                yScale={{ type: 'linear', min: 'auto', max: 'auto', stacked: true, reverse: false }}
                yFormat=" >-.2f"
                axisTop={null}
                axisRight={null}
                enableSlices={"x"}
                axisBottom={{
                    format: "%b %d",
                    legendOffset: -12
                  }}
                axisLeft={{
                    orient: 'left',
                    tickSize: 5,
                    tickPadding: 5,
                    tickRotation: 0,
                    legend: 'Value in GBP',
                    legendOffset: -60,
                    legendPosition: 'middle'
                }}
                enablePoints={false}
                pointColor={{ theme: 'background' }}
                pointBorderColor={{ from: 'serieColor' }}
                enablePointLabel={true}
                enableArea={true}
                areaOpacity={1}
                useMesh={true}

                sliceTooltip={({ slice }) => {
                    console.log(slice.points[0].data.xFormatted)
                    return (
                        <div class="p-3 border bg-white rounded-md grid">
                            <div class="font-semibold pb-2">Date: {slice.points[0].data.xFormatted} </div>
                            {slice.points.map(point => (
                                <div
                                    key={point.id}
                                    style={{
                                        color: point.serieColor,
                                        padding: '3px 0',
                                    }}
                                >
                                    <strong>{point.serieId}</strong> £{point.data.yFormatted} 
                                </div>
                            ))}
                        </div>
                    )
                }}

                legends={[
                    {
                        anchor: 'bottom-right',
                        direction: 'column',
                        justify: false,
                        translateX: 100,
                        translateY: 0,
                        itemsSpacing: 0,
                        itemDirection: 'left-to-right',
                        itemWidth: 80,
                        itemHeight: 20,
                        itemOpacity: 0.75,
                        symbolSize: 12,
                        symbolShape: 'circle',
                        symbolBorderColor: 'rgba(0, 0, 0, .5)',
                        effects: [
                            {
                                on: 'hover',
                                style: {
                                    itemBackground: 'rgba(0, 0, 0, .03)',
                                    itemOpacity: 1
                                }
                            }
                        ]
                    }
                ]}
            />
        )
    }
}

export default MyResponsiveLine;