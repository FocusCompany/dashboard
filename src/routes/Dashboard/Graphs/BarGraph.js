import React from "react";
import { ComposedChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import Graph from "./Graph";
import { getTimeFromSeconds } from "../../../utils";
import { withRouter } from "react-router-dom";

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
  return Math.ceil(metric.width * 1.1); // measureText method's return value may be slightly underestimated, add some pixels or scale it
}

/* if scrollbar
function getScrollBarWidth () {
	var inner = document.createElement('p');
	inner.style.width = "100%";
	inner.style.height = "200px";
  
	var outer = document.createElement('div');
	outer.style.position = "absolute";
	outer.style.top = "0px";
	outer.style.left = "0px";
	outer.style.visibility = "hidden";
	outer.style.width = "200px";
	outer.style.height = "150px";
	outer.style.overflow = "hidden";
	outer.appendChild (inner);
  
	document.body.appendChild (outer);
	var w1 = inner.offsetWidth;
	outer.style.overflow = 'scroll';
	var w2 = w1 === inner.offsetWidth ? outer.clientWidth : inner.offsetWidth;
  
	document.body.removeChild (outer);
  
	return (w1 - w2);
};*/

export class BarGraph extends Graph {
  render() {
    var maxWidth = 0;
    var tmpWidth = 0;
    for (var i = 0; i < this.state.data.length; i++) {
      tmpWidth = getTextWidth(this.state.data[i].process);
      if (tmpWidth > maxWidth) {
        maxWidth = tmpWidth;
      }
    }
    var height = 38 + 25 * this.state.data.length;
    height = this.state.height;
    return (
      <div
        id="bar-graph"
        ref={this.myRef}
        style={{ width: this.state.width, height: height }}
      >
        <ComposedChart
          layout="vertical"
          width={this.state.pixelWidth}
          height={height}
          data={this.state.data}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
        >
          <XAxis
            type="number"
            tickFormatter={seconds => getTimeFromSeconds(seconds)}
          />
          <YAxis
            dataKey="process"
            type="category"
            width={maxWidth}
            interval={0}
          />
          <Bar
            dataKey="length"
            fill="#8884d8"
            onClick={
              this.props.clickable
                ? d => this.props.history.push(`/${d.process}`)
                : null
            }
          />
          <Tooltip
            cursor={false}
            formatter={seconds => getTimeFromSeconds(seconds)}
          />
        </ComposedChart>
      </div>
    );
  }
}

export default withRouter(BarGraph);
