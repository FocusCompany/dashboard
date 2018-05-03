import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Graph extends Component {
    constructor(props) {
        super(props);
        this.state = {
            width: props.width,
            height: props.height,
            pixelWidth: 0,
            pixelHeight: 0,
            data: props.data
        }
        this.myRef = React.createRef();
        this.updateState = this.updateState.bind(this);
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        return {
            width: nextProps.width,
            height: nextProps.height,
            pixelWidth: prevState.pixelWidth ? prevState.pixelWidth : 0,
            pixelHeight: prevState.pixelHeight ? prevState.pixelHeight : 0,
            data: nextProps.data
        }
    }

    updateState() {
        var width = typeof this.state.width === "string" ? this.myRef.current.clientWidth : this.state.width;
        var height = typeof this.state.height === "string" ? this.myRef.current.clientHeight : this.state.height;
        this.setState({width: this.state.width, pixelWidth: width, height: this.state.height, pixelHeight: height, data: this.state.data});
    }

    componentDidMount() {
        this.updateState();
        if (typeof this.state.width === "string" || typeof this.state.height === "string") {
            window.addEventListener("resize", this.updateDimensions.bind(this));
        }
    }

    componentWillUnmount() {
        window.removeEventListener("resize", this.updateDimensions);
    }

    updateDimensions() {
        this.updateState();
    }
}

Graph.propTypes = {
    data: PropTypes.array.isRequired
}

Graph.defaultProps = {
    width: "100%",
    height: "100%"
}

export default Graph;