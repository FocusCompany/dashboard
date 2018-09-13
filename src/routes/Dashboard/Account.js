import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';

import Typography from '@material-ui/core/Typography';

import { callRenewAPI, Toast } from '../../utils';

const styles = theme => ({
    container: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formControl: {
        margin: theme.spacing.unit,
        width: "90%",
    },
    card: {
        maxWidth: 600,
    },
    title: {
        marginBottom: 16,
        fontSize: 14,
    },
});

class Account extends Component {
    state = {
        first_name: '',
        last_name: '',
        password: '',
        new_password: '',
        email: '',
    }

    resetFields = () => {
		this.setState({
            first_name: '',
            last_name: '',
            password: '',
            new_password: '',
            email: '',
        });
	}

    handleChange = name => event => {
        event.preventDefault();
        this.setState({ [name]: event.target.value });
    };

    updateInfo = () => {
		if (this.state.password.length === 0)
			return Toast.error('You must enter your password to update your informations');

		callRenewAPI('/update_user', this.state, 'PUT', null, true)
		.then((res => {
			Toast.info('Updated account informations');
			this.resetFields();
		}))
		.catch(err => {
			Toast.error(err.responseJSON ? err.responseJSON.message : err.statusText);
		});
	}

	deleteAccount = () => {
		if (this.state.password.length === 0)
            return Toast.error('You must enter your password to delete your account');
            
		callRenewAPI('/delete_user', {password: this.state.password}, 'DELETE', null, true)
		.then(res => {
			Toast.success('Your account has been deleted');
			this.props.logOut(null, true);
		})
		.catch(err => {
			Toast.error(err.responseJSON ? err.responseJSON.message : err.statusText);
		});
	}

    render() {
        const { classes } = this.props;

        return (
            <Grid container direction="column" justify="center" alignItems="center">
                <div className={classes.card}>
                    <Typography className={classes.title} color="textSecondary">
                        Account Information
                    </Typography>
                        {
                            ["first_name", "last_name", "email", "new_password", "password"].map(name => {
                                return (
                                    <FormControl key={`fc-${name}`} className={classes.formControl}>
                                            <InputLabel key={`il-${name}`} htmlFor={`i-${name}`}>
                                                {name.replace('_', ' ').replace(/^\w/, c => c.toUpperCase())}
                                            </InputLabel>
                                            <Input
                                                key={`i-${name}`}
                                                id={`i-${name}`}
                                                type={name.includes('password') ? 'password' : 'text'}
                                                value={this.state[name]}
                                                onChange={this.handleChange(name)} />
                                        </FormControl>
                                    )
                                })
                        }
                    <Grid container direction="row" justify="space-evenly" alignItems="center" style={{paddingTop: 20}} >
                        <Button color="primary" variant="contained" onClick={this.updateInfo}>Update Info</Button>
                        <Button color="secondary" variant="contained" onClick={this.deleteAccount}>Delete Account</Button>
                    </Grid>
                </div>
            </Grid>
        );
    }
}

export default withStyles(styles)(Account);