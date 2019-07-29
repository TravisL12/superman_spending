import React, { useState } from "react";
import {
  VictoryLabel,
  VictoryAxis,
  VictoryChart,
  VictoryStack,
  VictoryLine,
  VictoryArea
} from "victory";
import { values } from "lodash";

const config = {
  animate: { duration: 500 },
  padding: { top: 10, bottom: 10, left: 10, right: 10 },
  height: 150,
  axisColor: "black",
  axisFontSize: 6
};

function CategoryGraph({ categories, colors, getMonthSums }) {
  const [graphType, setGraphType] = useState("stack");

  const data = values(categories).map(({ id }, idx) => {
    return getMonthSums(id).map((sum, idx) => {
      return { x: idx, y: sum / 100 };
    });
  });

  const stackChart = (
    <VictoryStack colorScale={colors}>
      {data.map((d, idx) => {
        return <VictoryArea data={d} key={idx} />;
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
          style={{ tickLabels: { fontSize: config.axisFontSize } }}
          tickCount={categories.length}
        />

        {/* Y-axis */}
        <VictoryAxis
          dependentAxis
          tickFormat={t => `$${t.toLocaleString()}`}
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
