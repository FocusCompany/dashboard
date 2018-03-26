class Dashboard extends React.Component {
    constructor(props) {
        super(props);

        this.navbarItems = ["Home", "Account"];

        var hash = window.location.hash.replace('#', '');

        this.state = {
            panel: Math.max(this.navbarItems.indexOf(hash), 0)
        };

        this.logOut = this.logOut.bind(this);
        this.changePanel = this.changePanel.bind(this);
    }

    changePanel(target) {
        if (this.navbarItems.length > target) {
            this.setState({panel: target});
        }
    }

    logOut(all, afterDeletion) {
        if (afterDeletion === true) {
            this.props.changeLoggedInState(false);
            return;
        }
        callRenewAPI(all === true ? '/delete_all_jwt' : '/delete_jwt', null, 'DELETE', null, true)
        .then(res => {
            Toast.success('Logging out...');
            this.props.changeLoggedInState(false);
        })
        .catch(err => {
            console.log(err);
            Toast.error('Could not delete using token, logging out regardless...');
            this.props.changeLoggedInState(false);
        });
    }

    render() {
        var panel;

        switch (this.navbarItems[this.state.panel]) {
            case 'Account':
                panel = <Account logOut={this.logOut} />;
                break;
            case 'Home':
                panel = <Home />;
                break
            default:
                panel = <div><h1>Placeholder for panel: {this.navbarItems[this.state.panel]}</h1></div>
                break;
        }

        return (
            <div>
                <Navbar logOut={this.logOut} navbarItems={this.navbarItems} currentPanel={this.state.panel} changePanel={this.changePanel} />
                {panel}
            </div>
        );
    }
}