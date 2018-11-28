import React, { Component } from "react";
import LocalizedStrings from "localized-strings";

import { withStyles } from "@material-ui/core/styles";

import { Toast } from "../../utils";

import Select from "react-select";
import { Button } from "@material-ui/core";

const strings = new LocalizedStrings({
  en: {
    doNoDisturbWhen: "Do not disturb when on:",
    error: "Could not get process list",
    reset: "Reset",
    update: "Update"
  },
  fr: {
    doNoDisturbWhen: "Ne pas déranger quand je suis sur:",
    error: "Impossible de récupérer la liste des processus",
    reset: "Réinitialiser",
    update: "Mettre à jour"
  }
});

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    margin: theme.spacing.unit
  }
});

class Filters extends Component {
  state = {
    processes: [],
    oldValues: [],
    currentValues: []
  };

  componentDidMount() {
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

  handleUpdateClick = () => {
    const newValues = this.state.currentValues.reduce((reducer, value) => {
      reducer.push(value.value);
      return reducer;
    }, []);
    console.log(newValues);
  };

  render() {
    const { classes } = this.props;
    return (
      <div>
        <span className={classes.formControl}>{strings.doNoDisturbWhen}</span>
        <Select
          className={classes.formControl}
          onChange={value => this.setState({ currentValues: value })}
          isMulti
          options={this.state.processes}
          value={this.state.currentValues}
        />
        <Button
          className={classes.formControl}
          color="secondary"
          variant="contained"
          onClick={() => this.setState({ currentValues: this.state.oldValues })}
        >
          {strings.reset}
        </Button>
        <Button
          className={classes.formControl}
          color="primary"
          variant="contained"
          onClick={this.handleUpdateClick}
        >
          {strings.update}
        </Button>
      </div>
    );
  }
}

export default withStyles(styles)(Filters);
