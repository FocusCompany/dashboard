import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import LocalizedStrings from "localized-strings";

import classNames from "classnames";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";
import ChevronLeftIcon from "@material-ui/icons/ChevronLeft";
import ChevronRightIcon from "@material-ui/icons/ChevronRight";

import ClickAwayListener from "@material-ui/core/ClickAwayListener";

import Divider from "@material-ui/core/Divider";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import DashboardIcon from "@material-ui/icons/Dashboard";
import AccountBoxIcon from "@material-ui/icons/AccountBox";
import DevicesIcon from "@material-ui/icons/Devices";
import FilterListIcon from "@material-ui/icons/FilterList";

import { callRenewAPI, Toast } from "../../utils";
import AccountRoute from "./Account";
import StatsRoute from "./Stats";
import DevicesRoute from "./Devices";
import FiltersRoute from "./Filters";

const drawerWidth = 240;

const strings = new LocalizedStrings({
  en: {
    loggingOut: "Logging out...",
    loggingOutError: "Could not delete using token, logging out regardless...",
    dashboard: "Dashboard",
    devices: "Devices",
    account: "Account",
    filters: "Filters",
    signOutButton: "Sign out"
  },
  fr: {
    loggingOut: "Déconnexion...",
    loggingOutError: "Impossible de supprimer le token, déconnexion...",
    dashboard: "Tableau de bord",
    devices: "Appareils",
    account: "Compte",
    filters: "Filtres",
    signOutButton: "Se déconnecter"
  }
});

const styles = theme => ({
  root: {
    flexGrow: 1,
    height: "100%"
  },
  grow: {
    flexGrow: 1
  },
  appFrame: {
    height: "100%",
    zIndex: 1,
    overflow: "hidden",
    position: "relative",
    display: "flex",
    width: "100%"
  },
  appBar: {
    position: "absolute",
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  "appBarShift-left": {
    marginLeft: drawerWidth
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20
  },
  hide: {
    display: "none"
  },
  drawerPaper: {
    position: "relative",
    width: drawerWidth
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "0 8px",
    ...theme.mixins.toolbar
  },
  content: {
    overflowX: "hidden",
    flexGrow: 1,
    backgroundColor: theme.palette.background.default,
    padding: theme.spacing.unit * 3,
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  "content-left": {
    marginLeft: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  "contentShift-left": {
    marginLeft: -drawerWidth // Put back to 0 for push
  }
});

class Dashboard extends Component {
  state = {
    open: false
  };

  handleDrawerOpen = () => {
    this.setState({ open: true });
  };

  handleDrawerClose = () => {
    this.setState({ open: false });
  };

  logOut = (all, afterDeletion) => {
    if (afterDeletion === true) {
      this.props.changeLoggedInState(false);
      return;
    }
    callRenewAPI(
      all === true ? "/delete_all_jwt" : "/delete_jwt",
      null,
      "DELETE",
      null,
      true
    )
      .then(_ => {
        Toast.success(strings.loggingOut);
        this.props.changeLoggedInState(false);
      })
      .catch(err => {
        console.log(err);
        Toast.error(strings.loggingOutError);
        this.props.changeLoggedInState(false);
      });
  };

  render() {
    const { classes, theme } = this.props;
    const { open } = this.state;

    const drawer = (
      <ClickAwayListener onClickAway={this.handleDrawerClose}>
        <Drawer
          variant="persistent"
          anchor="left"
          open={open}
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <div className={classes.drawerHeader}>
            <IconButton onClick={this.handleDrawerClose}>
              {theme.direction === "rtl" ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </div>
          <Divider />
          <List component="nav">
            <ListItem
              button
              component={Link}
              to="/"
              onClick={this.handleDrawerClose}
            >
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary={strings.dashboard} />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/devices"
              onClick={this.handleDrawerClose}
            >
              <ListItemIcon>
                <DevicesIcon />
              </ListItemIcon>
              <ListItemText primary={strings.devices} />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/account"
              onClick={this.handleDrawerClose}
            >
              <ListItemIcon>
                <AccountBoxIcon />
              </ListItemIcon>
              <ListItemText primary={strings.account} />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/filters"
              onClick={this.handleDrawerClose}
            >
              <ListItemIcon>
                <FilterListIcon />
              </ListItemIcon>
              <ListItemText primary={strings.filters} />
            </ListItem>
          </List>
        </Drawer>
      </ClickAwayListener>
    );

    return (
      <Router>
        <Switch>
          <Route path="/graph" component={StatsRoute} />

          <Route
            path="/"
            render={() => (
              <div className={classes.root}>
                <div className={classes.appFrame}>
                  <AppBar
                    className={classNames(classes.appBar, {
                      [classes.appBarShift]: open,
                      [classes[`appBarShift-left`]]: open
                    })}
                  >
                    <Toolbar>
                      <IconButton
                        color="inherit"
                        aria-label="Open drawer"
                        onClick={this.handleDrawerOpen}
                        className={classNames(
                          classes.menuButton,
                          open && classes.hide
                        )}
                      >
                        <MenuIcon />
                      </IconButton>
                      <Typography
                        variant="title"
                        color="inherit"
                        noWrap
                        className={classes.grow}
                      >
                        Focus
                      </Typography>
                      <Button color="inherit" onClick={this.logOut}>
                        {strings.signOutButton}
                      </Button>
                    </Toolbar>
                  </AppBar>
                  {drawer}
                  <main
                    className={classNames(
                      classes.content,
                      classes[`content-left`],
                      {
                        [classes.contentShift]: open,
                        [classes[`contentShift-left`]]: open
                      }
                    )}
                  >
                    <div className={classes.drawerHeader} />
                    <Route exact path="/" component={StatsRoute} />
                    <Route path="/devices" component={DevicesRoute} />
                    <Route
                      path="/account"
                      render={() => <AccountRoute logOut={this.logOut} />}
                    />
                    <Route path="/filters" component={FiltersRoute} />
                  </main>
                </div>
              </div>
            )}
          />
        </Switch>
      </Router>
    );
  }
}

export default withStyles(styles, { withTheme: true })(Dashboard);
