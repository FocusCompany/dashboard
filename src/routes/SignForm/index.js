import React, { Component } from "react";
import LocalizedStrings from "localized-strings";
import { withStyles } from "@material-ui/core/styles";
import Input from "@material-ui/core/Input";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import { callAPI, Toast } from "../../utils";
import { Typography } from "@material-ui/core";

const strings = new LocalizedStrings({
  en: {
    loggingIn: "Logging in",
    signUp: "sign_up",
    signIn: "sign_in",
    alreadyAccount: "Already have an account ?",
    noAccount: "Don't have an account ?",
    empty: "Fields can't be empty",
    firstName: "first_name",
    lastName: "last_name",
    email: "email",
    password: "password",
    reset:
      "To reset your password, send an email to support@thefocuscompany.me."
  },
  fr: {
    loggingIn: "Connexion",
    signUp: "incription",
    signIn: "connexion",
    alreadyAccount: "Vous avez déjà un compte ?",
    noAccount: "Pas de compte ?",
    empty: "Les champs ne peuvent pas être vides",
    firstName: "prénom",
    lastName: "nom",
    email: "courriel",
    password: "mot_de_passe",
    reset:
      "Pour réinitialiser votre mot de passe, envoyer un courriel à support@thefocuscompany.me."
  }
});

const styles = theme => ({
  container: {
    display: "flex",
    flexWrap: "wrap"
  },
  formControl: {
    margin: theme.spacing.unit,
    width: 300,
    maxWidth: "90%"
  },
  reset: {
    margin: "8px"
  }
});

class SignForm extends Component {
  state = {
    first_name: "",
    last_name: "",
    password: "",
    email: "",
    mode: strings.signUp
  };

  handleChange = name => event => {
    event.preventDefault();
    if (name === strings.firstName)
      this.setState({ first_name: event.target.value });
    else if (name === strings.lastName)
      this.setState({ last_name: event.target.value });
    else if (name === strings.email)
      this.setState({ email: event.target.value });
    else if (name === strings.password)
      this.setState({ password: event.target.value });
    else this.setState({ [name]: event.target.value });
  };

  handleSubmit = event => {
    event.preventDefault();
    switch (this.state.mode) {
      case strings.signUp:
        this.signUp();
        break;
      case strings.signIn:
        this.signIn();
        break;
      default:
    }
  };

  changeMode = () => {
    this.setState({
      mode: this.state.mode === strings.signIn ? strings.signUp : strings.signIn
    });
  };

  signIn = () => {
    callAPI(
      "/login",
      {
        email: this.state.email,
        password: this.state.password
      },
      "POST"
    )
      .then(res => {
        this.props.changeLoggedInState(true, res.token);
      })
      .catch(err => {
        Toast.error(err.responseJSON.message);
      });
  };

  signUp = () => {
    if (
      this.state.last_name.trim() === "" ||
      this.state.first_name.trim() === "" ||
      this.state.email.trim() === "" ||
      this.state.password.trim() === ""
    ) {
      Toast.error(strings.empty);
      return;
    }
    callAPI(
      "/register",
      {
        first_name: this.state.first_name,
        last_name: this.state.last_name,
        email: this.state.email,
        password: this.state.password
      },
      "POST"
    )
      .then(res => {
        Toast.success(res.message);
        this.changeMode();
      })
      .catch(err => {
        Toast.error(err.responseJSON.message);
      });
  };

  render() {
    const { classes } = this.props;
    const inputs =
      this.state.mode === strings.signUp
        ? [strings.firstName, strings.lastName, strings.email, strings.password]
        : [strings.email, strings.password];
    return (
      <form onSubmit={this.handleSubmit}>
        <Grid container direction="column" justify="center" alignItems="center">
          {inputs.map(name => {
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
                    name === "password" || name === "mot_de_passe"
                      ? "password"
                      : "text"
                  }
                  value={this.state[name]}
                  onChange={this.handleChange(name)}
                  onKeyPress={ev => {
                    if (ev.key === "Enter") {
                      this.handleSubmit(ev);
                    }
                  }}
                />
              </FormControl>
            );
          })}
          <Button
            variant="contained"
            color="primary"
            className={classes.formControl}
            onClick={this.handleSubmit}
          >
            {this.state.mode
              .replace("_", " ")
              .replace(/^\w/, c => c.toUpperCase())}
          </Button>
          {this.state.mode === strings.signIn ? (
            <Typography className={classes.reset}>{strings.reset}</Typography>
          ) : null}
          <Button className={classes.button} onClick={this.changeMode}>
            {this.state.mode === strings.signUp
              ? strings.alreadyAccount
              : strings.noAccount}
          </Button>
        </Grid>
      </form>
    );
  }
}

export default withStyles(styles)(SignForm);
