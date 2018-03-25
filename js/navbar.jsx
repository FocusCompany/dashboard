function Navbar(props) {
    const items = props.navbarItems.map((value, index) => 
        <li key={index} className={'nav-item' + (props.currentPanel === index ? ' active' : '')}>
            <a className="nav-link" href={'#' + value} onClick={() => props.changePanel(index)}>{value}</a>
        </li>
    )

    return (
        <nav className="navbar navbar-expand-lg fixed-top navbar-light bg-light">
            <a className="navbar-brand" href="#">Focus</a>
            <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor03" aria-controls="navbarColor03" aria-expanded="false" aria-label="Toggle navigation">
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className="collapse navbar-collapse" id="navbarColor03">
                <ul className="navbar-nav mr-auto">
                    {items}
                </ul>
                <form className="form-inline my-2 my-lg-0">
                    <a className="btn btn-secondary my-2 my-sm-0" onClick={props.logOut}>Sign Out</a>
                </form>
            </div>
        </nav>
    );
}