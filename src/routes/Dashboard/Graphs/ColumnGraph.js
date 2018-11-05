import React from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import Graph from "./Graph";

function getFont() {
  const div = document.querySelector("body");
  const style = window.getComputedStyle(div);
  return (
    style.getPropertyValue("font-size") +
    " " +
    style.getPropertyValue("font-family")
  );
}

function getTextWidth(text) {
  var canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (!context) {
    return 0;
  }
  context.font = getFont();
  const metric = context.measureText(text);
  return Math.ceil(metric.width * 0.7); // measureText method's return value may be slightly underestimated, add some pixels or scale it
}

class ColumnGraph extends Graph {
  render() {
    var maxHeight = 0;
    var tmpHeight = 0;
    for (var i = 0; i < this.state.data.length; i++) {
      tmpHeight = getTextWidth(this.state.data[i].process);
      if (tmpHeight > maxHeight) {
        maxHeight = tmpHeight;
      }
    }
    return (
      <div
        ref={this.myRef}
        style={{ width: this.state.width, height: this.state.height }}
      >
        <BarChart
          width={this.state.pixelWidth}
          height={this.state.pixelHeight}
          data={this.state.data}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <XAxis
            dataKey="process"
            type="category"
            angle={-45}
            textAnchor="end"
            height={maxHeight}
            interval={0}
          />
          <YAxis type="number" />
          <Bar dataKey="length" fill="#8884d8" />
          <Tooltip cursor={false} />
        </BarChart>
      </div>
    );
  }
}

export default ColumnGraph;
