import React, { Component } from "react";
import LocalizedStrings from "localized-strings";

import { withStyles } from "@material-ui/core/styles";

import { callRenewAPI, Toast } from "../../utils";

import GraphData from "./Graphs/GraphData";

import Select from "react-select";

const strings = new LocalizedStrings({
  en: {
    doNoDisturbWhen: "Do not disturb when on:"
  },
  fr: {
    doNoDisturbWhen: "Ne pas déranger quand je suis sur:"
  }
});

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    margin: theme.spacing.unit,
    width: "90%"
  },
  card: {
    maxWidth: 600
  },
  title: {
    marginBottom: 16,
    fontSize: 14
  }
});

function totalToOptions(total) {
  const processes = [
    ...new Set(
      total.reduce(
        (reducer, currentValue) =>
          reducer.concat(
            currentValue.reduce((reducer2, currentValue2) => {
              let process = currentValue2.process
                .replace(/\.[^/.]+$/, "")
                .replace("-", " ");
              process =
                process[0].toUpperCase() + process.substr(1).toLowerCase();
              reducer2.push(process);
              return reducer2;
            }, [])
          ),
        []
      )
    )
  ];
  return processes.map(process => ({ value: process, label: process }));
}

async function getDeviceTotal(device) {
  const options = { device, start: 0, end: Math.floor(Date.now() / 1000) };
  await new Promise(resolve => setTimeout(resolve, 600));
  try {
    return await GraphData.get("total", options, true);
  } catch (err) {
    return [];
  }
}

class Filters extends Component {
  state = {
    total: []
  };

  async componentDidMount() {
    callRenewAPI("/get_devices", null, "GET", null, true)
      .then(async res => {
        const total = await res.devices.reduce(
          async (previousPromise, device) => {
            const reducer = await previousPromise;
            const newValue = await getDeviceTotal(device.id_devices);
            reducer.push(newValue);
            return reducer;
          },
          []
        );
        this.setState({ total });
      })
      .catch(err => {
        Toast.error(strings.error);
      });
  }

  render() {
    return (
      <div>
        <span>{strings.doNoDisturbWhen}</span>
        <Select
          onChange={value => console.log(value)}
          isMulti
          options={totalToOptions(this.state.total)}
        />
      </div>
    );
  }
}

export default withStyles(styles)(Filters);
