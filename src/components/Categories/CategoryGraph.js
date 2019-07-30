import React, { useState } from "react";
import {
  VictoryLabel,
  VictoryAxis,
  VictoryChart,
  VictoryStack,
  VictoryLine,
  VictoryArea,
  VictoryTooltip
} from "victory";
import { currency, formatDate } from "utilities/date-format-utils";

const config = {
  animate: { duration: 500 },
  padding: { top: 10, bottom: 25, left: 10, right: 10 },
  height: 150,
  axisColor: "black",
  axisFontSize: 6
};

function CategoryGraph({ data, colors, dateRange }) {
  const [graphType, setGraphType] = useState("stack");
  const categoryCount = data.length;

  const stackChart = (
    <VictoryStack colorScale={colors}>
      {data.map((d, idx) => {
        return (
          <VictoryArea
            labelComponent={<VictoryTooltip />}
            data={d}
            key={idx}
            events={[
              {
                target: "data",
                eventHandlers: {
                  onMouseOver: () => {
                    return [
                      {
                        target: "data",
                        mutation: () => ({ style: { fill: "gold" } })
                      },
                      {
                        target: "labels",
                        mutation: () => ({ active: true })
                      }
                    ];
                  },
                  onMouseOut: () => {
                    return [
                      {
                        target: "data",
                        mutation: () => {}
                      },
                      {
                        target: "labels",
                        mutation: () => ({ active: false })
                      }
                    ];
                  }
                }
              }
            ]}
          />
        );
      })}
    </VictoryStack>
  );

  const lineChart = data.map((d, idx) => {
    return (
      <VictoryLine
        data={d}
        key={idx}
        style={{
          data: { stroke: colors[idx] }
        }}
      />
    );
  });

  return (
    <>
      <button
        onClick={() => {
          setGraphType("stack");
        }}
      >
        Stack Chart
      </button>
      <button
        onClick={() => {
          setGraphType("line");
        }}
      >
        Line Chart
      </button>
      <VictoryChart
        animate={config.animate}
        padding={config.padding}
        height={config.height}
      >
        {graphType === "stack" ? stackChart : lineChart}

        {/* X-axis */}
        <VictoryAxis
          crossAxis={false}
          tickCount={categoryCount}
          tickFormat={t => {
            const { year, month } = dateRange[t];
            return formatDate(month, year, {
              month: "short",
              year: "numeric"
            });
          }}
          tickLabelComponent={<VictoryLabel dx={1} dy={-2} angle={-90} />}
          style={{
            tickLabels: { fontSize: 4 },
            grid: {
              strokeDasharray: "3, 15",
              stroke: config.axisColor
            }
          }}
        />

        {/* Y-axis */}
        <VictoryAxis
          dependentAxis
          tickFormat={t => currency(t, { minimumFractionDigits: 0 })}
          tickLabelComponent={<VictoryLabel dx={35} dy={-5} />}
          style={{
            axis: { stroke: 0 },
            tickLabels: {
              fill: config.axisColor,
              fontSize: config.axisFontSize,
              fontWeight: 600
            },
            grid: {
              strokeDasharray: "15, 5",
              stroke: config.axisColor
            }
          }}
        />
      </VictoryChart>
    </>
  );
}

export default CategoryGraph;
