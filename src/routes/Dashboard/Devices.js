import React, { Component } from "react";
import LocalizedStrings from "localized-strings";
import Grid from "@material-ui/core/Grid";

import { withStyles } from "@material-ui/core/styles";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

import GroupWorkIcon from "@material-ui/icons/GroupWork";

import { callRenewAPI, Toast } from "../../utils";

import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";
import PermDeviceIformationIcon from "@material-ui/icons/PermDeviceInformation";

import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import withMobileDialog from "@material-ui/core/withMobileDialog";

import FormGroup from "@material-ui/core/FormGroup";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import FormControl from "@material-ui/core/FormControl";
import Select from "@material-ui/core/Select";
import Checkbox from "@material-ui/core/Checkbox";
import Chip from "@material-ui/core/Chip";

const strings = new LocalizedStrings({
  en: {
    error: "Could not get device list",
    errorGroup: "Could not get group list",
    errorDelete: "Could not delete device",
    successDelete: "Device deleted successfully",
    devices: "Devices",
    groups: "Groups",
    changeDescription:
      "Here you can change a device's groups or delete the device.",
    deleteDevice: "Delete device",
    discard: "Discard",
    save: "Save",
    deleteGroup: "Delete group",
    delete: "Delete"
  },
  fr: {
    error: "Impossible d'obtenir la liste des appareils",
    errorGroup: "Impossible d'obtenir la liste des groupes",
    errorDelete: "Impossible de supprimer l'appareil",
    successDelete: "Appareil supprimé",
    devices: "Appareils",
    groups: "Groupes",
    changeDescription:
      "Ici vous pouvez changer le groupe d'un appareil ou supprimer l'appareil.",
    deleteDevice: "Supprimer l'appareil",
    discard: "Annuler",
    save: "Sauvegarder",
    deleteGroup: "Supprimer le groupe",
    delete: "Supprimer"
  }
});

const styles = theme => ({
  root: {
    width: "100%"
  },
  list: {
    width: "100%",
    backgroundColor: theme.palette.background.paper
  },
  listItem: {
    width: "100%"
  },
  editor: {
    root: {
      display: "flex",
      flexWrap: "wrap"
    },
    formControl: {
      margin: theme.spacing.unit,
      minWidth: 120,
      maxWidth: 300
    },
    chips: {
      display: "flex",
      flexWrap: "wrap"
    },
    chip: {
      margin: theme.spacing.unit / 4
    }
  }
});

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250
    }
  }
};

class Devices extends Component {
  groups = [];

  state = {
    editor: false,
    ed_delete: false,
    collections: [],

    groupDelete: false
  };

  refresh = () => {
    callRenewAPI("/get_devices", null, "GET", null, true)
      .then(res => {
        this.setState({ devices: res.devices });
        callRenewAPI("/list_group", null, "GET", null, true)
          .then(res => {
            this.setState({ collections: res.collections });
          })
          .catch(err => {
            Toast.error(strings.error);
          });
      })
      .catch(err => {
        Toast.error(strings.errorGroup);
      });
  };

  componentDidMount() {
    this.refresh();
  }

  editDevice = id => {
    const device = this.state.devices.find(d => d.id_devices === id);
    this.old_groups = device.collections.map(c => c.collections_name);
    this.groups = this.state.collections.map(c => c.collections_name);
    this.setState({
      editor: true,
      device,
      groups: this.old_groups,
      ed_delete: false
    });
  };

  closeEditor = () => {
    this.setState({ editor: false });
    this.refresh();
  };

  saveEditor = async () => {
    if (this.state.ed_delete) {
      callRenewAPI(
        "/delete_device",
        { device_id: `${this.state.device.id_devices}`, keep_data: "false" },
        "DELETE",
        null,
        true
      )
        .then(res => {
          Toast.success(strings.successDelete);
        })
        .catch(err => {
          Toast.error(strings.errorDelete);
        });
    } else {
      const dev_id = this.state.device.id_devices;
      const deleted = [];
      this.old_groups.forEach(g => {
        if (!this.state.groups.includes(g)) deleted.push(g);
      });

      const added = [];
      this.state.groups.forEach(g => {
        if (!this.old_groups.includes(g)) added.push(g);
      });

      for (let i = 0; i < added.length; i++)
        await callRenewAPI(
          "/add_device_to_group",
          { collections_name: added[i], device_id: dev_id },
          "POST",
          null,
          true
        );
      for (let i = 0; i < deleted.length; i++)
        await callRenewAPI(
          "/remove_device_from_group",
          { collections_name: deleted[i], device_id: dev_id },
          "DELETE",
          null,
          true
        );
    }
    this.closeEditor();
  };

  closeGroupDelete = () => {
    this.setState({ groupDelete: false });
    this.refresh();
  };

  deleteGroup = async group => {
    if (group) {
      this.setState({ groupDelete: true, group });
    } else {
      await callRenewAPI(
        "/delete_group",
        { collections_name: this.state.group },
        "DELETE",
        null,
        true
      );
    }
  };

  handleCheckChange = name => event => {
    this.setState({ [name]: event.target.checked });
  };

  handleGroupChange = event => {
    this.setState({ groups: event.target.value });
  };

  render() {
    const { classes, fullScreen } = this.props;

    return (
      <Grid container direction="row" justify="center" alignItems="center">
        <div className={classes.root}>
          <ExpansionPanel defaultExpanded>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>
                {strings.devices}
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <List component="nav" className={classes.list}>
                <Grid container spacing={24}>
                  {this.state.devices
                    ? this.state.devices.map(d => {
                        const groups = d.collections.length
                          ? strings.groups +
                            ": " +
                            d.collections.map(c => c.collections_name)
                          : "";
                        return (
                          <Grid xs={12} sm={6} md={4} lg={3} xl={2}>
                            <ListItem
                              button
                              onClick={() => this.editDevice(d.id_devices)}
                              className={classes.listItem}
                              key={d.id_devices}
                            >
                              <Avatar>
                                <PermDeviceIformationIcon />
                              </Avatar>
                              <ListItemText
                                primary={d.devices_name}
                                secondary={`${groups}`}
                              />
                            </ListItem>
                          </Grid>
                        );
                      })
                    : null}
                </Grid>
              </List>
            </ExpansionPanelDetails>
          </ExpansionPanel>

          <ExpansionPanel defaultExpanded>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography className={classes.heading}>
                {strings.groups}
              </Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <List component="nav" className={classes.list}>
                <Grid container spacing={24}>
                  {this.state.collections
                    ? this.state.collections.map(c => {
                        return (
                          <Grid xs={12} sm={6} md={4} lg={3} xl={2}>
                            <ListItem
                              button
                              onClick={() =>
                                this.deleteGroup(c.collections_name)
                              }
                              className={classes.listItem}
                              key={c.id_collections}
                            >
                              <Avatar>
                                <GroupWorkIcon />
                              </Avatar>
                              <ListItemText primary={c.collections_name} />
                            </ListItem>
                          </Grid>
                        );
                      })
                    : null}
                </Grid>
              </List>
            </ExpansionPanelDetails>
          </ExpansionPanel>

          <Dialog
            fullScreen={fullScreen}
            open={this.state.editor}
            onClose={this.closeEditor}
            aria-labelledby="responsive-dialog-title"
          >
            <DialogTitle id="responsive-dialog-title">{`Device Editor - ${this
              .state.device && this.state.device.devices_name}`}</DialogTitle>
            <DialogContent>
              <DialogContentText>{strings.changeDescription}</DialogContentText>

              <FormGroup>
                <FormControl className={classes.editor.formControl}>
                  <InputLabel htmlFor="select-multiple-chip">
                    {strings.groups}
                  </InputLabel>
                  <Select
                    multiple
                    value={this.state.groups}
                    onChange={this.handleGroupChange}
                    input={<Input id="select-multiple-chip" />}
                    renderValue={selected => (
                      <div className={classes.editor.chips}>
                        {selected.map(value => (
                          <Chip
                            key={value}
                            label={value}
                            className={classes.editor.chip}
                          />
                        ))}
                      </div>
                    )}
                    MenuProps={MenuProps}
                  >
                    {this.groups.map(value => (
                      <MenuItem key={value} value={value}>
                        {value}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={this.state.ed_delete}
                      onChange={this.handleCheckChange("ed_delete")}
                      value="checkedA"
                    />
                  }
                  label={strings.deleteDevice}
                />
              </FormGroup>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.closeEditor} color="secondary">
                {strings.discard}
              </Button>
              <Button
                onClick={this.saveEditor}
                variant="contained"
                color="primary"
                autoFocus
              >
                {strings.save}
              </Button>
            </DialogActions>
          </Dialog>

          <Dialog
            fullScreen={fullScreen}
            open={this.state.groupDelete}
            onClose={this.closeGroupDelete}
            aria-labelledby="responsive-dialog-title"
          >
            <DialogTitle id="responsive-dialog-title">{`Group Delete - ${
              this.state.group
            }`}</DialogTitle>
            <DialogContent>
              <DialogContentText>
                {strings.deleteGroup} {this.state.group} ?
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.closeGroupDelete} color="secondary">
                {strings.discard}
              </Button>
              <Button
                onClick={this.deleteGroup}
                variant="contained"
                color="secondary"
                autoFocus
              >
                {strings.delete}
              </Button>
            </DialogActions>
          </Dialog>
        </div>
      </Grid>
    );
  }
}

export default withMobileDialog()(withStyles(styles)(Devices));
