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
import { Hidden } from "@material-ui/core";

const strings = new LocalizedStrings({
  en: {
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
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  }
});

class Stats extends Component {
  state = {
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
        this.setState({ devices: res.devices });
        this.refreshData(res.devices[0].id_devices);
      })
      .catch(err => {
        console.log(err);
        Toast.error(strings.error);
      });
  }

  refreshData = device => {
    const options = { device, start: 0, end: Math.floor(Date.now() / 1000) };
    GraphData.get("total", options, true).then(t_data => {
      GraphData.get("heatmap", options).then(h_data => {
        GraphData.get("summary", options).then(s_data => {
          this.setState({
            summary: s_data,
            heatmap: h_data,
            total: t_data,
            device
          });
        });
      });
    });
  };

  handleChange = event => {
    this.refreshData(event.target.value);
  };

  render() {
    const { classes } = this.props;

    return (
      <Grid container direction="row" justify="center" alignItems="center">
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
