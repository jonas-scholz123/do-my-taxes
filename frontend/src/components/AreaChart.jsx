import { ResponsiveLine } from '@nivo/line'
import React from 'react';

function AreaChart(props) { 

        return (
            <ResponsiveLine
                data={props.data}
                margin={{ top: 50, right: 0, bottom: 35, left: 80 }}
                xScale={{
                        type: "time",
                        format: "%Y-%m-%d"
                        }}
                xFormat="time:%Y-%m-%d"
                yScale={{ type: 'linear', min: 0, max: 'auto', stacked: true, reverse: false }}
                yFormat=" >-.2f"
                axisTop={null}
                axisRight={null}
                enableSlices={"x"}
                axisBottom={{
                    format: "%b %d",
                    legendOffset: -12,
                    tickValues: 5
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
                /*
                legends={[
                    {
                        anchor: 'top-left',
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
                ]} */
            />
        )
    }

export default AreaChart;