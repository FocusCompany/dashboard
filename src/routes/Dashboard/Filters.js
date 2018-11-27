import React, { Component } from "react";
import LocalizedStrings from "localized-strings";

import { withStyles } from "@material-ui/core/styles";

import { Toast } from "../../utils";

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

class Filters extends Component {
  state = {
    processes: []
  };

  async componentDidMount() {
    fetch("http://backend.thefocuscompany.me:8080/process/list", {
      method: "POST",
      headers: {
        Authorization: localStorage.getItem("token"),
        "Content-Type": "application/x-www-form-urlencoded"
      }
    })
      .then(data => data.json())
      .then(data => {
        this.setState({
          processes: data.reduce((reducer, process) => {
            if (process !== "")
              reducer.push({ value: process, label: process });
            return reducer;
          }, [])
        });
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
          options={this.state.processes}
        />
      </div>
    );
  }
}

export default withStyles(styles)(Filters);
