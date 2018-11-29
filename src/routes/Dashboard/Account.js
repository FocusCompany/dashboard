import React, { Component } from "react";
import LocalizedStrings from "localized-strings";

import { withStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";

import Typography from "@material-ui/core/Typography";

import { callRenewAPI, Toast } from "../../utils";

const strings = new LocalizedStrings({
  en: {
    title: "Account Information",
    updateButton: "Update Info",
    updateNoPassword:
      "You must enter your password to update your informations",
    deleteNoPassword: "You must enter your password to delete your account",
    deleteButton: "Delete Account",
    updateSuccess: "Updated account informations",
    deleteSuccess: "Your account has been deleted",
    firstName: "first_name",
    lastName: "last_name",
    email: "email",
    newPassword: "new_password",
    password: "password"
  },
  fr: {
    title: "Informations du compte",
    updateButton: "Mettre à jour",
    updateNoPassword:
      "Vous devez entrer un mot de passe pour mettre à jour vos informations",
    deleteNoPassword:
      "Vous devez entrer un mot de passe pour supprimer votre compte",
    deleteButton: "Supprimer le compte",
    updateSuccess: "Informations du compte mises à jour",
    deleteSuccess: "Votre compte a bien été supprimé",
    firstName: "prénom",
    lastName: "nom",
    email: "courriel",
    newPassword: "nouveau_mot_de_passe",
    password: "mot_de_passe"
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

class Account extends Component {
  state = {
    first_name: "",
    last_name: "",
    password: "",
    new_password: "",
    email: ""
  };

  resetFields = () => {
    this.setState({
      first_name: "",
      last_name: "",
      password: "",
      new_password: "",
      email: ""
    });
  };

  handleChange = name => event => {
    event.preventDefault();
    this.setState({ [name]: event.target.value });
  };

  updateInfo = () => {
    if (this.state.password.length === 0)
      return Toast.error(strings.updateNoPassword);

    const toUpdate = { password: this.state.password };
    if (this.state.first_name !== "")
      toUpdate.first_name = this.state.first_name;
    if (this.state.last_name !== "") toUpdate.last_name = this.state.last_name;
    if (this.state.new_password !== "")
      toUpdate.new_password = this.state.new_password;
    if (this.state.email !== "") toUpdate.email = this.state.email;

    callRenewAPI("/update_user", toUpdate, "PUT", null, true)
      .then(res => {
        Toast.success(strings.updateSuccess);
        this.resetFields();
      })
      .catch(err => {
        Toast.error(
          err.responseJSON ? err.responseJSON.message : err.statusText
        );
      });
  };

  deleteAccount = () => {
    if (this.state.password.length === 0)
      return Toast.error(strings.deleteNoPassword);

    callRenewAPI(
      "/delete_user",
      { password: this.state.password },
      "DELETE",
      null,
      true
    )
      .then(res => {
        Toast.success(strings.deleteSuccess);
        this.props.logOut(null, true);
      })
      .catch(err => {
        Toast.error(
          err.responseJSON ? err.responseJSON.message : err.statusText
        );
      });
  };

  render() {
    const { classes } = this.props;

    return (
      <Grid container direction="column" justify="center" alignItems="center">
        <div className={classes.card}>
          <Typography className={classes.title} color="textSecondary">
            {strings.title}
          </Typography>
          {[
            strings.firstName,
            strings.lastName,
            strings.email,
            strings.newPassword,
            strings.password
          ].map(name => {
            return (
              <FormControl key={`fc-${name}`} className={classes.formControl}>
                <InputLabel key={`il-${name}`} htmlFor={`i-${name}`}>
                  {name
                    .replace(new RegExp("_", "g"), " ")
                    .replace(/^\w/, c => c.toUpperCase())}
                </InputLabel>
                <Input
                  key={`i-${name}`}
                  id={`i-${name}`}
                  type={
                    name.includes("password") || name.includes("mot_de_passe")
                      ? "password"
                      : "text"
                  }
                  value={this.state[name]}
                  onChange={this.handleChange(name)}
                />
              </FormControl>
            );
          })}
          <Grid
            container
            direction="row"
            justify="space-evenly"
            alignItems="center"
            style={{ paddingTop: 20 }}
          >
            <Button
              color="primary"
              variant="contained"
              onClick={this.updateInfo}
            >
              {strings.updateButton}
            </Button>
            <Button
              color="secondary"
              variant="contained"
              onClick={this.deleteAccount}
            >
              {strings.deleteButton}
            </Button>
          </Grid>
        </div>
      </Grid>
    );
  }
}

export default withStyles(styles)(Account);
