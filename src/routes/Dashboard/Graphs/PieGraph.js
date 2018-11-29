import React from "react";
import { PieChart, Pie, Cell, Legend, Tooltip } from "recharts";
import PropTypes from "prop-types";
import Graph from "./Graph";
import { getTimeFromSeconds } from "../../../utils";
import { withRouter } from "react-router-dom";

const COLORS = [
  "#e6194b",
  "#3cb44b",
  "#ffe119",
  "#4363d8",
  "#f58231",
  "#911eb4",
  "#46f0f0",
  "#f032e6",
  "#bcf60c",
  "#fabebe",
  "#008080",
  "#e6beff",
  "#9a6324",
  "#fffac8",
  "#800000",
  "#aaffc3",
  "#808000",
  "#ffd8b1",
  "#000075",
  "#808080",
  "#ffffff",
  "#000000"
];

export class PieGraph extends Graph {
  render() {
    var legend = this.props.legend ? (
      <Legend
        layout="vertical"
        align="right"
        verticalAlign="middle"
        wrapperStyle={{ height: "100%", overflowY: "scroll" }}
      />
    ) : null;
    var tooltip = this.props.tooltip ? (
      <Tooltip formatter={seconds => getTimeFromSeconds(seconds)} />
    ) : null;
    return (
      <div
        ref={this.myRef}
        style={{ width: this.state.width, height: this.state.height }}
      >
        <PieChart
          width={this.state.pixelWidth}
          height={this.state.pixelHeight}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <Pie
            data={this.state.data}
            nameKey="process"
            dataKey="length"
            onClick={
              this.props.clickable
                ? d => this.props.history.push(`/${d.process}`)
                : null
            }
          >
            {this.state.data.map((entry, index) => (
              <Cell
                key={index}
                fill={this.props.colors[index % this.props.colors.length]}
              />
            ))}
          </Pie>
          {legend}
          {tooltip}
        </PieChart>
      </div>
    );
  }
}

PieGraph.propTypes = {
  data: PropTypes.array.isRequired
};

PieGraph.defaultProps = {
  width: "100%",
  height: "100%",
  legend: true,
  tooltip: true,
  colors: COLORS,
  clickable: true
};

export default withRouter(PieGraph);
