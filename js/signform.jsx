class SignForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {formType: props.type, inputs: {
            firstName: '',
            lastName: '',
            email: '',
            password: ''
        }};

        this.signIn = this.signIn.bind(this);
        this.signUp = this.signUp.bind(this);
        this.onChange = this.onChange.bind(this);
    }
    
    onChange(e) {
        this.state.inputs[e.target.name] = e.target.value;
        this.setState({inputs: this.state.inputs});
    }

    signIn() {
        callAPI('/login', {
            email: this.state.inputs.email,
            password: this.state.inputs.password
        }, 'POST')
        .then(res => {
            Toast.info('Logging in');
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

    render() {
        var formElements;
        if (this.state.formType === "SignUp")
            formElements = (
                <div className="form-group">
                    <input className="form-control" onChange={this.onChange} value={this.state.inputs.firstName} pos="top" name="firstName" placeholder="First Name" type="text" />
                    <input className="form-control" onChange={this.onChange} value={this.state.inputs.lastName} pos="middle" name="lastName" placeholder="Last Name" type="text" />
                    <input className="form-control" onChange={this.onChange} value={this.state.inputs.email} pos="middle" name="email" placeholder="Email" type="text" />
                    <input className="form-control" onChange={this.onChange} value={this.state.inputs.password} pos="bottom" name="password" placeholder="Password" type="password" />
                    <a className="btn btn-primary btn-block"  onClick={this.signUp}>Sign Up</a><br/>
                    Already a member ? <a href="#" onClick={() => this.setState({formType: "SignIn"})}>Sign In</a>
                </div>
            );
        else // For indentation clarity
            formElements = (
                <div className="form-group">
                    <input className="form-control" onChange={this.onChange} value={this.state.inputs.email} pos="top" name="email" placeholder="Email" type="text" />
                    <input className="form-control" onChange={this.onChange} value={this.state.inputs.password} pos="bottom" name="password" placeholder="Password" type="password" />
                    <a className="btn btn-primary btn-block"  onClick={this.signIn}>Sign In</a><br/>
                    Don't have an account ? <a href="#" onClick={() => this.setState({formType: "SignUp"})}>Sign Up</a>
                </div>
            );
        return (
            <div className="form-signin">
                <form className="form-signin">
                    {formElements}
                </form>
            </div>
        )
    }
}