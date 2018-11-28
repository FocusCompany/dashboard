import React, { Component } from "react";
import LocalizedStrings from "localized-strings";

import Grid from "@material-ui/core/Grid";

import PieGraph from "./Graphs/PieGraph";
import CombinedBarGraph from "./Graphs/CombinedBarGraph";
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
    errorGroup: "Could not get group list",
    noGroup: "No group exists",
    all: "All",
    group: "Group",
    device: "Device",
    year: "Year",
    month: "Month",
    week: "Week",
    day: "Day",
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
    errorGroup: "Impossible d'obtenir la liste des groupes",
    noGroup: "Aucun groupe n'existe",
    all: "Tout",
    group: "Groupe",
    device: "Appareil",
    year: "Année",
    month: "Mois",
    week: "Semaine",
    day: "Jour",
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
    fontFamily: "Roboto",
    whiteSpace: "nowrap"
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
    category: localStorage.getItem("category") || "week",
    subcategory: localStorage.getItem("subcategory") || "all",
    date: localStorage.getItem("date")
      ? moment(localStorage.getItem("date")).startOf(
          localStorage.getItem("category") || "week"
        )
      : moment().startOf(localStorage.getItem("category") || "week"),
    collections: [],
    collection: parseInt(localStorage.getItem("collection"), 10) || 0,
    devices: [],
    device: parseInt(localStorage.getItem("device"), 10) || 0,
    forReset: false,
    process: this.props.match.params.process,

    calendar: [], // Calendar data
    total: [], // Processes data, pie and bar for now
    heatmap: [], // Heatmap data
    summary: [] // Idle vs activity half pie
  };

  componentDidMount() {
    callRenewAPI("/get_devices", null, "GET", null, true)
      .then(res => {
        const old_device = res.devices.find(
          e => e.id_devices === this.state.device
        );
        const new_device = old_device
          ? old_device.id_devices
          : res.devices[0].id_devices;
        localStorage.setItem("device", new_device);
        this.setState({
          devices: res.devices,
          device: new_device
        });
        callRenewAPI("/list_group", null, "GET", null, true)
          .then(res => {
            const old_collection = res.collections.find(
              e => e.id_collections === this.state.collection
            );
            const new_collection =
              res.collections.length > 0
                ? old_collection
                  ? old_collection.id_collections
                  : res.collections[0].id_collections
                : 0;
            localStorage.setItem("collection", new_collection);
            this.setState(
              {
                collections: res.collections,
                collection: new_collection
              },
              () => this.handleRefreshData({})
            );
          })
          .catch(err => {
            Toast.error(strings.errorGroup);
          });
      })
      .catch(err => {
        console.log(err);
        Toast.error(strings.error);
      });
  }

  refreshData = ({ device, collection }) => {
    const dateTmp = moment(this.state.date);
    let options = {};
    if (device) {
      if (this.state.category === "global") {
        options = { device };
      } else {
        options = {
          device,
          from: dateTmp.toISOString(),
          to: dateTmp.add(1, this.state.category).toISOString()
        };
      }
    } else if (collection) {
      if (this.state.category === "global") {
        options = { collection };
      } else {
        options = {
          group: collection,
          from: dateTmp.toISOString(),
          to: dateTmp.add(1, this.state.category).toISOString()
        };
      }
    } else {
      if (this.state.category !== "global") {
        options = {
          from: dateTmp.toISOString(),
          to: dateTmp.add(1, this.state.category).toISOString()
        };
      }
    }
    GraphData.get("total", options, true, this.state.process).then(t_data => {
      GraphData.get("heatmap", options, true, this.state.process).then(
        h_data => {
          GraphData.get("summary", options, true, this.state.process).then(
            s_data => {
              this.setState(
                {
                  summary: s_data,
                  heatmap: h_data,
                  total: t_data,
                  forReset: !this.state.forReset
                },
                () => this.forceUpdate()
              );
            }
          );
        }
      );
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
          Toast.info(strings.noGroup);
          this.setState({ subcategory: "all" }, () => this.refreshData({}));
        }
      } else {
        this.refreshData({ device: this.state.device });
      }
    }
  };

  handleChange = event => {
    localStorage.setItem("device", event.target.value);
    this.setState({ device: event.target.value }, () =>
      this.refreshData({ device: event.target.value })
    );
  };

  handleChangeGroup = event => {
    localStorage.setItem("collection", event.target.value);
    this.setState({ collection: event.target.value }, () =>
      this.refreshData({ collection: event.target.value })
    );
  };

  handleSubstractDate = () => {
    if (this.state.category === "global") return;
    const dateTmp = moment(this.state.date).subtract(1, this.state.category);
    localStorage.setItem("date", dateTmp.toISOString());
    this.setState({ date: dateTmp }, this.handleRefreshData);
  };

  handleAddDate = () => {
    if (this.state.category === "global") return;
    const dateTmp = moment(this.state.date).add(1, this.state.category);
    localStorage.setItem("date", dateTmp.toISOString());
    this.setState({ date: dateTmp }, this.handleRefreshData);
  };

  handleResetDate = () => {
    if (this.state.category === "global") {
      this.setState({ forReset: !this.state.forReset });
    } else {
      const dateTmp = moment().startOf(this.state.category);
      localStorage.setItem("date", dateTmp.toISOString());
      this.setState(
        {
          forReset: !this.state.forReset,
          date: dateTmp
        },
        this.handleRefreshData
      );
    }
  };

  handleChangeCategory = category => {
    localStorage.setItem("category", category);
    this.setState(
      { category, date: moment().startOf(category) },
      this.handleRefreshData
    );
  };

  handleChangeSubCategory = subcategory => {
    localStorage.setItem("subcategory", subcategory);
    this.setState({ subcategory }, this.handleRefreshData);
  };

  render() {
    const { classes } = this.props;
    const dateTmp = moment(this.state.date);
    let dateString = "";
    switch (this.state.category) {
      case "global":
        dateString = "Global";
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
      default:
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
      default:
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
              {strings.all}
            </Pager.Item>
            <Pager.Item
              className={`${classes.pagerItem} ${
                this.state.subcategory === "group"
                  ? classes.pagerItemClicked
                  : ""
              }`}
              onClick={() => this.handleChangeSubCategory("group")}
            >
              {strings.group}
            </Pager.Item>
            <Pager.Item
              className={`${classes.pagerItemRight} ${
                this.state.subcategory === "device"
                  ? classes.pagerItemClicked
                  : ""
              }`}
              onClick={() => this.handleChangeSubCategory("device")}
            >
              {strings.device}
            </Pager.Item>
          </Pager>
          <Pager className={classes.pager}>
            <Pager.Item
              className={`${classes.pagerItemLeft} ${
                this.state.category === "global" ? classes.pagerItemClicked : ""
              }`}
              onClick={() => this.handleChangeCategory("global")}
            >
              Global
            </Pager.Item>
            <Pager.Item
              className={`${classes.pagerItem} ${
                this.state.category === "year" ? classes.pagerItemClicked : ""
              }`}
              onClick={() => this.handleChangeCategory("year")}
            >
              {strings.year}
            </Pager.Item>
            <Pager.Item
              className={`${classes.pagerItem} ${
                this.state.category === "month" ? classes.pagerItemClicked : ""
              }`}
              onClick={() => this.handleChangeCategory("month")}
            >
              {strings.month}
            </Pager.Item>
            <Pager.Item
              className={`${classes.pagerItem} ${
                this.state.category === "week" ? classes.pagerItemClicked : ""
              }`}
              onClick={() => this.handleChangeCategory("week")}
            >
              {strings.week}
            </Pager.Item>
            <Pager.Item
              className={`${classes.pagerItemRight} ${
                this.state.category === "day" ? classes.pagerItemClicked : ""
              }`}
              onClick={() => this.handleChangeCategory("day")}
            >
              {strings.day}
            </Pager.Item>
          </Pager>
        </Grid>
        <Grid item xs={12} className={classes.row}>
          {subcategorySelect}
          {this.state.category !== "global" ? (
            <Pager className={classes.pager}>
              <Pager.Item
                className={classes.pagerItemLeft}
                onClick={this.handleSubstractDate}
              >
                &larr;
              </Pager.Item>
              <span className={classes.pagerItem}>{dateString}</span>
              {this.state.category !== "global" ? (
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
                {strings.reset}
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
                  <CalendarHeatmapGraph
                    key={`${this.state.category}/${this.state.device}/${
                      this.state.collection
                    }/${this.state.forReset}`}
                    data={this.state.heatmap}
                    overview={this.state.category}
                  />
                ) : (
                  strings.heatmapNoData
                )}
              </Typography>
            </Paper>
          </Grid>
        </Hidden>
        <Grid item xs={12} md={6}>
          <Paper className={classes.root} elevation={1}>
            <Typography variant="headline" component="h4">
              {strings.totalTimeSpent}
            </Typography>
            <Typography>
              {this.state.total.length > 0 ? (
                <PieGraph
                  data={this.state.total}
                  height="300px"
                  clickable={false}
                />
              ) : (
                strings.totalTimeSpentNoData
              )}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
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
        <Grid item xs={12}>
          <Paper className={classes.root} elevation={1}>
            <Typography variant="headline" component="h4">
              {strings.processActivity}
            </Typography>
            <Typography>
              {this.state.total.length > 0 ? (
                <CombinedBarGraph
                  data={this.state.total}
                  height={400}
                  clickable={false}
                />
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
