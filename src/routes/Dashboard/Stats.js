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
    group: "Group",
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
    group: "Groupe",
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
    margin: theme.spacing.unit,
    fontFamily: "Roboto"
  },
  formControl: {
    margin: theme.spacing.unit,
    paddingRight: theme.spacing.unit * 2,
    minWidth: 120,
    width: "100%",
    flex: "1 1 50%"
  },
  row: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center"
  },
  topGraph: {
    marginTop: "16px"
  },
  pager: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 0,
    flex: "1 1 50%"
  },
  pagerItem: {
    display: "block",
    border: "1px solid #000000AA",
    paddingTop: "8px",
    paddingBottom: "8px",
    backgroundColor: "#E6E6E6",
    marginLeft: "-1px",
    fontFamily: "Roboto"
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
    marginLeft: "24px"
  },
  selectEmpty: {
    marginTop: theme.spacing.unit * 2
  }
});

class Stats extends Component {
  state = {
    date: moment().startOf("week"),
    category: "week",
    subcategory: "all",
    collections: [],
    collection: 0,
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
        console.log(res);
        this.setState({
          devices: res.devices,
          device: res.devices[0].id_devices
        });
      })
      .catch(err => {
        console.log(err);
        Toast.error(strings.error);
      });
    callRenewAPI("/list_group", null, "GET", null, true)
      .then(res => {
        this.setState({
          collections: res.collections,
          collection:
            res.collections.length > 0
              ? res.collections[0].id_collections
              : null
        });
      })
      .catch(err => {
        Toast.error("Could not get device list");
      });
    this.refreshData({});
  }

  refreshData = ({ device, collection }) => {
    const dateTmp = moment(this.state.date);
    let options = {};
    if (device) {
      if (this.state.category === "total") {
        options = { device };
      } else {
        options = {
          device,
          from: dateTmp.toISOString(),
          to: dateTmp.add(1, this.state.category).toISOString()
        };
      }
    } else if (collection) {
      if (this.state.category === "total") {
        options = { collection };
      } else {
        options = {
          group: collection,
          from: dateTmp.toISOString(),
          to: dateTmp.add(1, this.state.category).toISOString()
        };
      }
    } else {
      if (this.state.category !== "total") {
        options = {
          from: dateTmp.toISOString(),
          to: dateTmp.add(1, this.state.category).toISOString()
        };
      }
    }
    GraphData.get("total", options, true).then(t_data => {
      GraphData.get("heatmap", options).then(h_data => {
        GraphData.get("summary", options).then(s_data => {
          this.setState(
            {
              summary: s_data,
              heatmap: h_data,
              total: t_data
            },
            () => this.forceUpdate()
          );
        });
      });
    });
  };

  handleRefreshData = () => {
    if (this.state.devices && this.state.devices.length > 0) {
      if (this.state.subcategory === "all") {
        this.refreshData({});
      } else if (this.state.subcategory === "group") {
        if (this.state.collection) {
          this.refreshData({ collection: this.state.collection });
        } else {
          Toast.info("No group exists");
          this.setState({ subcategory: "all" }, () => this.refreshData({}));
        }
      } else {
        this.refreshData({ device: this.state.device });
      }
    }
  };

  handleChange = event => {
    this.setState({ device: event.target.value }, () =>
      this.refreshData({ device: event.target.value })
    );
  };

  handleChangeGroup = event => {
    this.setState({ collection: event.target.value }, () =>
      this.refreshData({ collection: event.target.value })
    );
  };

  handleSubstractDate = () => {
    if (this.state.category === "total") return;
    const dateTmp = moment(this.state.date);
    this.setState(
      { date: dateTmp.subtract(1, this.state.category) },
      this.handleRefreshData
    );
  };

  handleAddDate = () => {
    if (this.state.category === "total") return;
    const dateTmp = moment(this.state.date);
    this.setState(
      { date: dateTmp.add(1, this.state.category) },
      this.handleRefreshData
    );
  };

  handleResetDate = () => {
    if (this.state.category === "total") return;
    this.setState(
      { date: moment().startOf(this.state.category) },
      this.handleRefreshData
    );
  };

  handleChangeCategory = category => {
    this.setState(
      { category, date: moment().startOf(category) },
      this.handleRefreshData
    );
  };

  handleChangeSubCategory = subcategory => {
    this.setState({ subcategory }, this.handleRefreshData);
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

    let subcategorySelect = <div className={classes.pager} />;
    switch (this.state.subcategory) {
      case "group":
        subcategorySelect = (
          <FormControl className={classes.formControl}>
            <InputLabel htmlFor="age-simple">{strings.group}</InputLabel>
            <Select
              value={this.state.collection}
              onChange={this.handleChangeGroup}
              inputProps={{
                name: "group",
                id: "age-simple"
              }}
            >
              {this.state.collections.map(d => (
                <MenuItem value={d.id_collections}>{`${d.collections_name} [${
                  d.id_collections
                }]`}</MenuItem>
              ))}
            </Select>
          </FormControl>
        );
        break;
      case "device":
        subcategorySelect = (
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
        );
        break;
    }

    return (
      <Grid container direction="row" justify="center" alignItems="center">
        <Grid item xs={12} className={classes.row}>
          <Pager className={classes.pager}>
            <Pager.Item
              className={`${classes.pagerItemLeft} ${
                this.state.subcategory === "all" ? classes.pagerItemClicked : ""
              }`}
              onClick={() => this.handleChangeSubCategory("all")}
            >
              All
            </Pager.Item>
            <Pager.Item
              className={`${classes.pagerItem} ${
                this.state.subcategory === "group"
                  ? classes.pagerItemClicked
                  : ""
              }`}
              onClick={() => this.handleChangeSubCategory("group")}
            >
              Group
            </Pager.Item>
            <Pager.Item
              className={`${classes.pagerItem} ${
                this.state.subcategory === "device"
                  ? classes.pagerItemClicked
                  : ""
              }`}
              onClick={() => this.handleChangeSubCategory("device")}
            >
              Device
            </Pager.Item>
          </Pager>
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
        <Grid item xs={12} className={classes.row}>
          {subcategorySelect}
          {this.state.category !== "total" ? (
            <Pager className={classes.pager}>
              <Pager.Item
                className={classes.pagerItemLeft}
                onClick={this.handleSubstractDate}
              >
                &larr;
              </Pager.Item>
              <span className={classes.pagerItem}>{dateString}</span>
              {this.state.category !== "total" ? (
                <Pager.Item
                  className={classes.pagerItemRight}
                  onClick={this.handleAddDate}
                >
                  &rarr;
                </Pager.Item>
              ) : null}
              <Button
                className={classes.resetButton}
                color="primary"
                variant="contained"
                onClick={this.handleResetDate}
              >
                Reset
              </Button>
            </Pager>
          ) : null}
        </Grid>
        <Hidden mdDown>
          <Grid item xs={12} className={classes.topGraph}>
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
