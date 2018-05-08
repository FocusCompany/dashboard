import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip } from 'recharts';
import PropTypes from 'prop-types';
import Graph from './Graph';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

class PieGraph extends Graph {
    render() {
        var legend = this.props.legend ? (<Legend layout="vertical" align="right" verticalAlign="middle"/>) : null;
        var tooltip = this.props.tooltip ? (<Tooltip/>) : null;
        return (
            <div ref={this.myRef} style={{width: this.state.width, height: this.state.height}}>
                <PieChart width={this.state.pixelWidth} height={this.state.pixelHeight} margin={{top: 20, right: 20, bottom: 20, left: 20}}>
                    <Pie data={this.state.data} nameKey="process" dataKey="length">
                        {this.state.data.map((entry, index) => <Cell key={index} fill={this.props.colors[index % this.props.colors.length]}/>)}
                    </Pie>
                    {legend}
                    {tooltip}
                </PieChart>
            </div>
        );
    }
}

PieGraph.propTypes = {
    data: PropTypes.array.isRequired
}

PieGraph.defaultProps = {
    width: "100%",
	height: "100%",
    legend: true,
    tooltip: true,
    colors: COLORS
};

export default PieGraph;