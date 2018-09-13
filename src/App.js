import React, { Component } from 'react';
import Dashboard from './routes/Dashboard';
import SignForm from './routes/SignForm';

export default class App extends Component {
	constructor(props) {
		super(props);
        localStorage.isLoggedIn = (typeof localStorage.isLoggedIn === 'undefined') ? "false" : localStorage.isLoggedIn;
        
		this.state = {isLoggedIn: localStorage.isLoggedIn === "true"}; // Some (Firefox + ???) have local storage as strings only
		
        this.changeLoggedInState = this.changeLoggedInState.bind(this);
    }

	changeLoggedInState(b, token) {
		localStorage.isLoggedIn = b;
		localStorage.token = token;
		this.setState({isLoggedIn: b});
	}

    render() {
        if (this.state.isLoggedIn === true) {
            return (
                <Dashboard changeLoggedInState={this.changeLoggedInState} />
            );
        } else { // For indentation clarity
            return (
                <SignForm changeLoggedInState={this.changeLoggedInState} />
            );
        }
    }
}