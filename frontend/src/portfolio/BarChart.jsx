import React from 'react';
import { ResponsiveBar } from '@nivo/bar'

function MyResponsiveBar(props) {

    const data = [
        {
            "planOrActual": "actual",
            "ETFs": 83,
            "stocks": 12,
            "bets": 1,
            "bonds": 0,
            "cash": 4,
        },
        {
            "planOrActual": "plan",
            "ETFs": 80,
            "stocks": 10,
            "bets": 1,
            "bonds": 3,
            "cash": 6,
        }
    ]

  return (

    <ResponsiveBar
        data={data}
        keys={["ETFs", "bets", "stocks", "bonds", "cash"]}
        indexBy="planOrActual"
        margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
        padding={0.25}
        layout="horizontal"
        valueScale={{ type: 'linear' }}
        indexScale={{ type: 'band', round: true }}
        colors={{ scheme: 'nivo' }}
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
                id: 'lines',
                type: 'patternLines',
                background: 'inherit',
                color: '#eed312',
                rotation: -45,
                lineWidth: 6,
                spacing: 10
            }
        ]}
        fill={[
            {
                match: {
                    id: 'cash'
                },
                id: 'dots'
            },
            {
                match: {
                    id: 'stocks'
                },
                id: 'lines'
            }
        ]}
        borderColor={{ from: 'color', modifiers: [ [ 'darker', 1.6 ] ] }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
        }}
        axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
        }}
        labelSkipWidth={12}
        labelSkipHeight={12}
        labelTextColor={{ from: 'color', modifiers: [ [ 'darker', '2.5' ] ] }}
        legends={[
            {
                dataFrom: 'keys',
                anchor: 'bottom-right',
                direction: 'row',
                justify: false,
                translateX: 0,
                translateY: -150,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                    {
                        on: 'hover',
                        style: {
                            itemOpacity: 1
                        }
                    }
                ]
            }
        ]}
        label={d => `${d.value}%`}
        animate={true}
        motionStiffness={90}
        motionDamping={15}
    />
  )
}

export default MyResponsiveBar;