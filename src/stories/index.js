import React from "react";

import { storiesOf } from "@storybook/react";

import BarGraph from "../routes/Dashboard/Graphs/BarGraph";
import ColumnGraph from "../routes/Dashboard/Graphs/ColumnGraph";
import HalfPieGraph from "../routes/Dashboard/Graphs/HalfPieGraph";
import PieGraph from "../routes/Dashboard/Graphs/PieGraph";

let DATA = [
  { process: "chrome", length: 1200 },
  { process: "word", length: 600 },
  { process: "visual studio code", length: 1400 },
  { process: "skype", length: 800 }
];

let SUMMARY = [
  { name: "Activity", value: 80, percent: 80 },
  { name: "Idle", value: 20, percent: 20 }
];

storiesOf("Graphs", module)
  .add("BarGraph", () => <BarGraph data={DATA} height="300px" />)
  .add("ColumnGraph", () => <ColumnGraph data={DATA} height="300px" />)
  .add("HalfPieGraph", () => <HalfPieGraph data={SUMMARY} height="300px" />)
  .add("PieGraph", () => <PieGraph data={DATA} height="300px" />);
