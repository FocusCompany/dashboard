import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { callAPI, Toast } from '../../utils';

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing.unit,
        width: 300,
        maxWidth: "90%",
    },
});

class SignForm extends Component {
    state = {
        first_name: '',
        last_name: '',
        password: '',
        email: '',
        mode: 'sign_up',
    };
    
    handleChange = name => event => {
        event.preventDefault();
        this.setState({ [name]: event.target.value });
    };

    handleSubmit = event => {
        event.preventDefault();
        switch (this.state.mode) {
            case 'sign_up':
                this.signUp();
                break;
            case 'sign_in':
                this.signIn();
                break;
            default:
        }
    }

    changeMode = () => {
        this.setState({ mode: this.state.mode === 'sign_in' ? 'sign_up' : 'sign_in' });
    }

    signIn = () => {
		callAPI('/login', {
			email: this.state.email,
			password: this.state.password
		}, 'POST')
		.then(res => {
			Toast.info('Logging in');
			this.props.changeLoggedInState(true, res.token);
		})
		.catch(err => {
			Toast.error(err.responseJSON.message);
		});
	}

	signUp = () => {
		callAPI('/register', {
			first_name: this.state.first_name,
			last_name: this.state.last_name,
			email: this.state.email,
			password: this.state.password
		}, 'POST')
		.then(res => {
			Toast.success(res.message);
            this.changeMode();
		})
		.catch(err => {
			Toast.error(err.responseJSON.message);
		});
	}
    
    render() {
        const { classes } = this.props;
        const inputs = this.state.mode === 'sign_up' ?
            ["first_name", "last_name", "email", "password"] :
            ["email", "password"];
        return (
            <form onSubmit={this.handleSubmit}>
                <Grid
                    container
                    direction="column"
                    justify="center"
                    alignItems="center"
                >
                    {
                        inputs.map(name => {
                            return (
                                <FormControl key={`fc-${name}`} className={classes.formControl}>
                                    <InputLabel key={`il-${name}`} htmlFor={`i-${name}`}>
                                        {name.replace('_', ' ').replace(/^\w/, c => c.toUpperCase())}
                                    </InputLabel>
                                    <Input
                                        key={`i-${name}`}
                                        id={`i-${name}`}
                                        type={name === 'password' ? 'password' : 'text'}
                                        value={this.state[name]}
                                        onChange={this.handleChange(name)} />
                                </FormControl>
                            )
                        })
                    }
                    <Button variant="contained" color="primary" className={classes.formControl} onClick={this.handleSubmit}>
                        { this.state.mode.replace('_', ' ').replace(/^\w/, c => c.toUpperCase()) }
                    </Button>
                    <Button className={classes.button} onClick={this.changeMode}>
                        { this.state.mode === 'sign_up' ? 'Already have an account ?' : 'Don\'t have an account ?' }
                    </Button>
                </Grid>
            </form>
        );
    }
}

export default withStyles(styles)(SignForm);