import React, { Component } from 'react';
import { callRenewAPI, Toast, camelToSnake } from './Util';

export default class Account extends Component {
    constructor(props) {
        super(props);

        this.state = {
            inputs: {
                firstName: '',
                lastName: '',
                email: '',
                password: '',
                newPassword: ''
            }
        }

        this.onChange = this.onChange.bind(this);
        this.updateInfo = this.updateInfo.bind(this);
        this.deleteAccount = this.deleteAccount.bind(this);
        this.resetFields = this.resetFields.bind(this);
    }

    resetFields() {
        for (var key in this.state.inputs) {
            if (this.state.inputs.hasOwnProperty(key)) {
                // eslint-disable-next-line
                this.state.inputs[key] = '';
            }
        }
        this.setState({inputs: this.state.inputs});
    }

    onChange(e) {
        // eslint-disable-next-line
        this.state.inputs[e.target.name] = e.target.value;
        this.setState({inputs: this.state.inputs});
    }

    updateInfo() {
        if (this.state.inputs.password.length === 0)
            return Toast.error('You must enter your password to update your informations');
        var inputs = {}
        for (var key in this.state.inputs) {
            if (this.state.inputs.hasOwnProperty(key)) {
                if (this.state.inputs[key] !== '') {
                    inputs[camelToSnake(key)] = this.state.inputs[key]
                };
            }
        }
        console.log(inputs);
        callRenewAPI('/update_user', inputs, 'PUT', null, true)
        .then((res => {
            Toast.info('Updated account informations');
            this.resetFields();
        }))
        .catch(err => {
            Toast.error(err.responseJSON ? err.responseJSON.message : err.statusText);
        });
    }

    deleteAccount() {
        if (this.state.inputs.password.length === 0)
            return Toast.error('You must enter your password to delete your account');
        callRenewAPI('/delete_user', {password: this.state.inputs.password}, 'DELETE', null, true)
        .then(res => {
            Toast.success('Your account has been deleted');
            this.props.logOut(null, true);
        })
        .catch(err => {
            Toast.error(err.responseJSON ? err.responseJSON.message : err.statusText);
        });
    }

    render() {
        return (
        <div className="container">
            <div className="row justify-content-md-center">
                <div className="col-5">
                    <div className="card bg-light mb-3">
                        <div className="card-header">Account Information</div>
                        <div className="card-body">
                            <form>
                                <div className="container-fluid">
                                    <div className="row">
                                        <div className="col padding-0"><input className="form-control" onChange={this.onChange} value={this.state.inputs.firstName} name="firstName" placeholder="First Name" type="text" /></div>
                                        <div className="col padding-0"><input className="form-control" onChange={this.onChange} value={this.state.inputs.lastName} name="lastName" placeholder="Last Name" type="text" /></div>
                                    </div>
                                    <div className="row">
                                        <div className="col padding-0"><input className="form-control" onChange={this.onChange} value={this.state.inputs.email} name="email" placeholder="Email" type="text" /></div>
                                    </div>
                                    <div className="row">
                                        <div className="col padding-0"><input className="form-control" onChange={this.onChange} value={this.state.inputs.password} name="password" placeholder="Current Password" type="password" /></div>
                                        <div className="col padding-0"><input className="form-control" onChange={this.onChange} value={this.state.inputs.newPassword} name="newPassword" placeholder=" New Password" type="password" /></div>
                                    </div>
                                    <br/>
                                    <div className="row">
                                        <div className="col padding-1"><a className="btn btn-primary btn-block"  onClick={this.updateInfo}>Update</a></div>
                                        <div className="col padding-1"><a className="btn btn-danger btn-block"  onClick={this.deleteAccount}>Delete Account</a></div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>);
    }
}