class Home extends React.Component {
    constructor(props) {
        super(props);

    }

    render() {
        var data = $.ajax({
            type: 'GET',
            url: 'http://backend.thefocuscompany.me:1234/data',
            crossDomain: true,
            async: false
        });
        console.log(data);

        if (data.statusText === "error")
            return (<div><h1>Data fetch error</h1></div>);

        return (<div className="container">
        <div className="row justify-content-md-center">
            <div className="col-9">
                <div className="card bg-light mb-3">
                    <div className="card-header">Recent Activities</div>
                    <div className="card-body">
                        <BarChart width="100%" data={JSON.parse(data.responseText)} name="chart"/>
                    </div>
                </div>
            </div>
        </div>
        <div className="row justify-content-md-center">
            <div className="col-9">
                <div className="card bg-light mb-3">
                    <div className="card-header">Recent Activities</div>
                    <div className="card-body">
                        <GraphJS data={JSON.parse(data.responseText)}/>
                    </div>
                </div>
            </div>
        </div>
    </div>);
    }
}