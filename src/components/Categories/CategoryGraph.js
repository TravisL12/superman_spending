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
import { currencyRounded, formatDate } from "utilities/date-format-utils";
import style from "./Categories.module.scss";

const config = {
  animate: { duration: 500 },
  padding: { top: 10, bottom: 25, left: 10, right: 10 },
  height: 220,
  axisColor: "black",
  axisFontSize: 6
};

function CategoryGraph({ categories, dateRange, toggleCumulative }) {
  const [graphType, setGraphType] = useState("stack");
  const graphData = categories.map(({ sum, color }) => {
    return sum.map((s, idx) => {
      return { x: idx, y: s, color };
    });
  });

  const eventHandlers = {
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
  };

  const stackChart = (
    <VictoryStack>
      {graphData.map((d, idx) => (
        <VictoryArea
          labelComponent={<VictoryTooltip />}
          data={d}
          key={idx}
          style={{
            data: { fill: d.color }
          }}
          events={[
            {
              target: "data",
              eventHandlers
            }
          ]}
        />
      ))}
    </VictoryStack>
  );

  const lineChart = graphData.map((d, idx) => {
    return (
      <VictoryLine
        data={d}
        key={idx}
        style={{
          data: { stroke: d.color }
        }}
        events={[
          {
            target: "data",
            eventHandlers
          }
        ]}
      />
    );
  });

  return (
    <div className={style.graph}>
      <button onClick={toggleCumulative}>Toggle Cumulative</button>
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
          tickCount={categories.length}
          tickFormat={t => {
            const { year, month } = dateRange[t];
            return formatDate(month, year, {
              month: "short",
              year: "numeric"
            });
          }}
          tickLabelComponent={<VictoryLabel dx={1} dy={-2} angle={-90} />}
          style={{
            tickLabels: { fontSize: 4 }
          }}
        />

        {/* Y-axis */}
        <VictoryAxis
          dependentAxis
          tickFormat={t => currencyRounded(t)}
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
    </div>
  );
}

export default CategoryGraph;
