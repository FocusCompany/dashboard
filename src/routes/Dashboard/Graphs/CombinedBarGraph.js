import React from "react";
import Graph from "./Graph";
import BarGraph from "./BarGraph";
import ColumnGraph from "./ColumnGraph";
import { withStyles } from "@material-ui/core/styles";
import { Pager } from "react-bootstrap";

const styles = theme => ({
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

class CombinedBarGraph extends Graph {
  state = {
    isColumn: localStorage.getItem("isColumn") || "false"
  };

  handleClick = () => {
    const tmp = this.state.isColumn === "false" ? "true" : "false";
    localStorage.setItem("isColumn", tmp);
    this.setState({ isColumn: tmp });
  };

  render() {
    const { classes } = this.props;
    return (
      <div
        id="bar-graph"
        ref={this.myRef}
        style={{
          width: this.state.width,
          height: `${this.state.height}px`,
          margin: 16
        }}
      >
        <Pager className={classes.pager}>
          <Pager.Item
            className={`${classes.pagerItemLeft} ${
              this.state.isColumn === "false" ? classes.pagerItemClicked : ""
            }`}
            onClick={this.handleClick}
          >
            Bar
          </Pager.Item>
          <Pager.Item
            className={`${classes.pagerItemRight} ${
              this.state.isColumn === "true" ? classes.pagerItemClicked : ""
            }`}
            onClick={this.handleClick}
          >
            Column
          </Pager.Item>
        </Pager>
        {this.state.isColumn === "false" ? (
          <BarGraph
            data={this.props.data}
            height={this.state.height - 40}
            clickable={this.props.clickable}
          />
        ) : (
          <ColumnGraph
            data={this.props.data}
            height="90%"
            clickable={this.props.clickable}
          />
        )}
      </div>
    );
  }
}

export default withStyles(styles)(CombinedBarGraph);
