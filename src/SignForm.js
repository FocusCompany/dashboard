import React, { Component } from 'react';
import { callAPI, Toast } from './Util';

export default class SignForm extends Component {
	constructor(props) {
		super(props);
		this.state = {formType: props.type, inputs: {
			firstName: '',
			lastName: '',
			email: '',
			password: '',
			stayLoggedIn: 'false'
		}};

		this.signIn = this.signIn.bind(this);
		this.signUp = this.signUp.bind(this);
		this.onChange = this.onChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	
	onChange(e) {
		if (e.target.type === "checkbox") {
			// eslint-disable-next-line
			this.state.inputs[e.target.name] = e.target.checked;
		} else {
			// eslint-disable-next-line
			this.state.inputs[e.target.name] = e.target.value;
		}
		this.setState({inputs: this.state.inputs});
	}

	signIn() {
		callAPI('/login', {
			email: this.state.inputs.email,
			password: this.state.inputs.password
		}, 'POST')
		.then(res => {
			Toast.info('Logging in');
			localStorage.stayLoggedIn = this.state.inputs.stayLoggedIn;
			this.props.changeLoggedInState(true, res.token);
		})
		.catch(err => {
			Toast.error(err.responseJSON.message);
		});
	}

	signUp() {
		callAPI('/register', {
			first_name: this.state.inputs.firstName,
			last_name: this.state.inputs.lastName,
			email: this.state.inputs.email,
			password: this.state.inputs.password
		}, 'POST')
		.then(res => {
			Toast.success(res.message);
			this.setState({formType: "SignIn"});
		})
		.catch(err => {
			Toast.error(err.responseJSON.message);
		});
	}

	handleSubmit(event) {
		event.preventDefault();
		switch (this.state.formType) {
			case "SignIn":
				this.signIn();
				break;
			case "SignUp":
				this.signUp();
				break;
			default:
				break;
		}
	}

	render() {
		var formElements;
		if (this.state.formType === "SignUp")
			formElements = (
				<div className="form-group">
					<input className="form-control" onChange={this.onChange} value={this.state.inputs.firstName} pos="top" name="firstName" placeholder="First Name" type="text" />
					<input className="form-control" onChange={this.onChange} value={this.state.inputs.lastName} pos="middle" name="lastName" placeholder="Last Name" type="text" />
					<input className="form-control" onChange={this.onChange} value={this.state.inputs.email} pos="middle" name="email" placeholder="Email" type="text" />
					<input className="form-control" onChange={this.onChange} value={this.state.inputs.password} pos="bottom" name="password" placeholder="Password" type="password" />
					<button className="btn btn-primary btn-block" >Sign Up</button><br/>
					Already a member ? <a href="#SignIn" onClick={() => this.setState({formType: "SignIn"})}>Sign In</a>
				</div>
			);
		else
			formElements = (
				<div className="form-group">
					<input className="form-control" onChange={this.onChange} value={this.state.inputs.email} pos="top" name="email" placeholder="Email" type="text" />
					<input className="form-control" onChange={this.onChange} value={this.state.inputs.password} pos="bottom" name="password" placeholder="Password" type="password" />
					<div className="form-check">
					  <label className="form-check-label">
						<input className="form-check-input" onChange={this.onChange} value="" name="stayLoggedIn" checked={this.state.inputs.stayLoggedIn} type="checkbox"/>
						Remember Me
					  </label>
					</div>
					<br/>
					<button className="btn btn-primary btn-block">Sign In</button><br/>
					Don't have an account ? <a href="#SignUp" onClick={() => this.setState({formType: "SignUp"})}>Sign Up</a>
				</div>
			);
		return (
			<div className="form-signin">
				<form className="form-signin" onSubmit={this.handleSubmit}>
					{formElements}
				</form>
			</div>
		)
	}
}