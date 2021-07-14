import { ResponsiveLine } from '@nivo/line'
import React from 'react';

function AreaChart(props) {
    // these are the tailwind indigo shades 100, 300, 400, 500, 600, 700
    const colors = ['#E0E7FF', '#A5B4FC', '#818CF8', '#6366F1', '#4338CA', '#4F46E5', '#312E81']

    return (
        <ResponsiveLine
            data={props.data}
            margin={{ top: 0, right: 0, bottom: 35, left: 60 }}
            xScale={{
                type: "time",
                format: "%Y-%m-%d"
            }}
            xFormat="time:%Y-%m-%d"
            yScale={{ type: 'linear', min: 0, max: 'auto', stacked: true, reverse: false }}
            yFormat=" >-.2f"
            axisTop={null}
            enableGridX={false}
            enableGridY={false}
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
                tickValues: 6,
                format: (value) => {
                    return "£ " + value.toLocaleString();
                }
            }}
            enablePoints={false}
            colors={colors}

            enablePointLabel={true}
            enableArea={true}
            areaOpacity={1}
            useMesh={true}
            sliceTooltip={({ slice }) => {
                const sum = slice.points.map((p) => p.data.y).reduce((a, b) => a + b, 0).toFixed(2)
                const summaries = slice.points.map(point => (
                    <div
                        key={point.id}
                        style={{
                            color: point.serieColor,
                        }}
                        class="pb-2 flex justify-between"
                    >
                        <strong class="px-3">{point.serieId}</strong> £{point.data.yFormatted}
                    </div>
                ))

                return (
                    <div class="p-3 border bg-white rounded-md grid">
                        <div class="font-semibold pb-2">Date: {slice.points[0].data.xFormatted} </div>
                        {summaries}
                        <div class="border-t border-black py-2 flex justify-between">
                            <strong class="px-3"> Total </strong> £{sum}
                        </div>
                    </div>
                )
            }}

            defs={[
                {
                    id: 'dots',
                    type: 'patternDots',
                    background: 'inherit',
                    color: '#38bcb2',
                    size: 4,
                    padding: 1,
                    stagger: true
                },
                {
                    id: 'blueLines',
                    type: 'patternLines',
                    background: 'inherit',
                    color: '#ffffff',
                    rotation: -45,
                    lineWidth: 6,
                    spacing: 10
                }
            ]}
            fill={[
                {
                    match: {
                        id: props.data.length > 2 ? props.data[2].id : null
                    },
                    id: 'lines'
                },
                {
                    match: {
                        id: props.data.length > 4 ? props.data[4].id : null
                    },
                    id: 'dots'
                }
            ]}
        />
    )
}

export default AreaChart;