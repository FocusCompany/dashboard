import React, { Component } from "react";
import LocalizedStrings from "localized-strings";

import Grid from "@material-ui/core/Grid";

import PieGraph from "./Graphs/PieGraph";
import ColumnGraph from "./Graphs/ColumnGraph";
import BarGraph from "./Graphs/BarGraph";
import HalfPieGraph from "./Graphs/HalfPieGraph";
import CalendarHeatmapGraph from "./Graphs/CalendarHeatmapGraph";

import GraphData from "./Graphs/GraphData";

import { withStyles } from "@material-ui/core/styles";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";

import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import { callRenewAPI, Toast } from "../../utils";
import { Hidden, Button } from "@material-ui/core";
import { Pager } from "react-bootstrap";
import moment from "moment";

const strings = new LocalizedStrings({
  en: {
    reset: "Reset",
    error: "Could not get device list",
    device: "Device",
    heatmap: "Heatmap",
    heatmapNoData: "No heatmap data",
    totalTimeSpent: "Total Time Spent",
    totalTimeSpentNoData: "No total data",
    activitySummary: "Activity Summary",
    activitySummaryNoData: "No summary data",
    processActivity: "Process Activity",
    processActivityNoData: "No procces activity data"
  },
  fr: {
    reset: "Réinitialiser",
    error: "Impossible d'obtenir la liste des appareils",
    device: "Appareil",
    heatmap: "Carte de Chaleur",
    heatmapNoData: "Aucune donnée de carte de chaleur",
    totalTimeSpent: "Temps Total Passé",
    totalTimeSpentNoData: "Aucune donnée de temps total",
    activitySummary: "Résumé des Activités",
    activitySummaryNoData: "Aucune donnée de résumé",
    processActivity: "Processus des Activités",
    processActivityNoData: "Aucune donnée de processus d'activité"
  }
});

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
    margin: theme.spacing.unit
  },
  formControl: {
    margin: theme.spacing.unit,
    paddingRight: theme.spacing.unit * 2,
    minWidth: 120,
    width: "100%"
  },
  pager: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 0
  },
  pagerItem: {
    display: "block",
    border: "1px solid #000000AA",
    paddingTop: "8px",
    paddingBottom: "8px",
    backgroundColor: "#E6E6E6",
    marginLeft: "-1px"
  },
  pagerItemLeft: {
    display: "block",
    border: "1px solid #000000AA",
    borderBottomLeftRadius: "3px",
    borderTopLeftRadius: "3px",
    paddingTop: "8px",
    paddingBottom: "8px",
    backgroundColor: "#E6E6E6"
  },
  pagerItemRight: {
    display: "block",
    border: "1px solid #000000AA",
    borderBottomRightRadius: "3px",
    borderTopRightRadius: "3px",
    paddingTop: "8px",
    paddingBottom: "8px",
    marginLeft: "-1px",
    backgroundColor: "#E6E6E6"
  },
  pagerItemClicked: {
    backgroundColor: "#BBBBBB"
  },
  resetButton: {
    display: "block",
    margin: "auto"
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  }
});

class Stats extends Component {
  state = {
    date: moment().startOf("week"),
    category: "week",
    devices: [],
    device: 0,

    calendar: [], // Calendar data
    total: [], // Processes data, pie and bar for now
    heatmap: [], // Heatmap data
    summary: [] // Idle vs activity half pie
  };

  componentDidMount() {
    callRenewAPI("/get_devices", null, "GET", null, true)
      .then(res => {
        this.setState({
          devices: res.devices,
          device: res.devices[0].id_devices
        });
        this.refreshData(res.devices[0].id_devices);
      })
      .catch(err => {
        console.log(err);
        Toast.error(strings.error);
      });
  }

  refreshData = device => {
    const dateTmp = moment(this.state.date);
    let options = {};
    if (this.state.category === "total") {
      options = { device };
    } else {
      options = {
        device,
        from: dateTmp.toISOString(),
        to: dateTmp.add(1, this.state.category).toISOString()
      }; //Math.floor(Date.now() / 1000) };
    }
    GraphData.get("total", options, true).then(t_data => {
      GraphData.get("heatmap", options).then(h_data => {
        GraphData.get("summary", options).then(s_data => {
          this.setState(
            {
              summary: s_data,
              heatmap: h_data,
              total: t_data,
              device
            },
            () => this.forceUpdate()
          );
        });
      });
    });
  };

  handleChange = event => {
    this.refreshData(event.target.value);
  };

  handleSubstractDate = () => {
    if (this.state.category === "total") return;
    const dateTmp = moment(this.state.date);
    this.setState({ date: dateTmp.subtract(1, this.state.category) }, () =>
      this.refreshData(this.state.device)
    );
  };

  handleAddDate = () => {
    if (this.state.category === "total") return;
    const dateTmp = moment(this.state.date);
    this.setState({ date: dateTmp.add(1, this.state.category) }, () =>
      this.refreshData(this.state.device)
    );
  };

  handleResetDate = () => {
    if (this.state.category === "total") return;
    this.setState({ date: moment().startOf(this.state.category) }, () =>
      this.refreshData(this.state.device)
    );
  };

  handleChangeCategory = category => {
    this.setState({ category, date: moment().startOf(category) }, () =>
      this.refreshData(this.state.device)
    );
  };

  render() {
    const { classes } = this.props;
    const dateTmp = moment(this.state.date);
    let dateString = "";
    switch (this.state.category) {
      case "total":
        dateString = "Total";
        break;
      case "year":
        dateString = dateTmp.format("YYYY");
        break;
      case "month":
        dateString = dateTmp.format("MM/YYYY");
        break;
      case "week":
        dateString = `${dateTmp.format("DD/MM/YYYY")} - ${dateTmp
          .add(6, "day")
          .format("DD/MM/YYYY")}`;
        break;
      case "day":
        dateString = `${dateTmp.format("DD/MM/YYYY")}`;
        break;
    }

    return (
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid item xs={12}>
          <Pager className={classes.pager}>
            <Pager.Item
              className={`${classes.pagerItemLeft} ${
                this.state.category === "total" ? classes.pagerItemClicked : ""
              }`}
              onClick={() => this.handleChangeCategory("total")}
            >
              Total
            </Pager.Item>
            <Pager.Item
              className={`${classes.pagerItem} ${
                this.state.category === "year" ? classes.pagerItemClicked : ""
              }`}
              onClick={() => this.handleChangeCategory("year")}
            >
              Year
            </Pager.Item>
            <Pager.Item
              className={`${classes.pagerItem} ${
                this.state.category === "month" ? classes.pagerItemClicked : ""
              }`}
              onClick={() => this.handleChangeCategory("month")}
            >
              Month
            </Pager.Item>
            <Pager.Item
              className={`${classes.pagerItem} ${
                this.state.category === "week" ? classes.pagerItemClicked : ""
              }`}
              onClick={() => this.handleChangeCategory("week")}
            >
              Week
            </Pager.Item>
            <Pager.Item
              className={`${classes.pagerItemRight} ${
                this.state.category === "day" ? classes.pagerItemClicked : ""
              }`}
              onClick={() => this.handleChangeCategory("day")}
            >
              Day
            </Pager.Item>
          </Pager>
        </Grid>
        <Grid item xs={12}>
          <Pager className={classes.pager}>
            {this.state.category !== "total" ? (
              <Pager.Item
                className={classes.pagerItemLeft}
                onClick={this.handleSubstractDate}
              >
                &larr;
              </Pager.Item>
            ) : null}
            <span className={classes.pagerItem}>{dateString}</span>
            {this.state.category !== "total" ? (
              <Pager.Item
                className={classes.pagerItemRight}
                onClick={this.handleAddDate}
              >
                &rarr;
              </Pager.Item>
            ) : null}
          </Pager>
          <Button
            className={classes.resetButton}
            color="primary"
            variant="contained"
            onClick={this.handleResetDate}
          >
            Reset
          </Button>
        </Grid>
        <Grid item xs={12}>
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="age-simple">{strings.device}</InputLabel>
            <Select
              value={this.state.device}
              onChange={this.handleChange}
              inputProps={{
                name: "device",
                id: "age-simple"
              }}
            >
              {this.state.devices.map(d => (
                <MenuItem value={d.id_devices}>{`${d.devices_name} [${
                  d.id_devices
                }]`}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Hidden mdDown>
          <Grid item xs={12}>
            <Paper className={classes.root} elevation={1}>
              <Typography variant="headline" component="h4">
                {strings.heatmap}
              </Typography>
              <Typography>
                {this.state.heatmap.length > 0 ? (
                  <CalendarHeatmapGraph data={this.state.heatmap} />
                ) : (
                  strings.heatmapNoData
                )}
              </Typography>
            </Paper>
          </Grid>
        </Hidden>
        <Grid item xs={12} md={4}>
          <Paper className={classes.root} elevation={1}>
            <Typography variant="headline" component="h4">
              {strings.totalTimeSpent}
            </Typography>
            <Typography>
              {this.state.total.length > 0 ? (
                <PieGraph data={this.state.total} height="300px" />
              ) : (
                strings.totalTimeSpentNoData
              )}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper className={classes.root} elevation={1}>
            <Typography variant="headline" component="h4">
              {strings.activitySummary}
            </Typography>
            <Typography>
              {this.state.total.length > 0 ? (
                <HalfPieGraph data={this.state.summary} height="300px" />
              ) : (
                strings.activitySummaryNoData
              )}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper className={classes.root} elevation={1}>
            <Typography variant="headline" component="h4">
              {strings.processActivity}
            </Typography>
            <Typography>
              {this.state.total.length > 0 ? (
                <ColumnGraph data={this.state.total} height="300px" />
              ) : (
                strings.processActivityNoData
              )}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper className={classes.root} elevation={1}>
            <Typography variant="headline" component="h4">
              {strings.processActivity}
            </Typography>
            <Typography>
              {this.state.total.length > 0 ? (
                <BarGraph data={this.state.total} height="300px" />
              ) : (
                strings.processActivityNoData
              )}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    );
  }
}

export default withStyles(styles)(Stats);
