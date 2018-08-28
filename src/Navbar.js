import React from 'react';

export default function Navbar(props) {
	const items = props.navbarItems.map((value, index) => 
		<li key={index} className={'nav-item' + (props.currentPanel === index ? ' active' : '')}>
			<a className="nav-link" href={'#' + value} onClick={() => props.changePanel(index)}>{value}</a>
		</li>
	)

	return (
		<nav className="navbar navbar-expand fixed-top navbar-dark bg-dark">
			<a className="navbar-brand" href="#Home">Focus</a>

			<div className="collapse navbar-collapse" id="navbarColor03">
				<ul className="navbar-nav mr-auto">
					{items}
				</ul>
				<form className="form-inline my-0">
					<a className="btn btn-secondary  my-0" onClick={props.logOut}>Sign Out</a>
				</form>
			</div>
		</nav>
	);
}