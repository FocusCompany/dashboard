import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, LabelList } from 'recharts';
import PropTypes from 'prop-types';
import Graph from './Graph';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

class HalfPieGraph extends Graph {
    render() {
        var legend = this.props.legend ? (<Legend align="center"/>) : null;
        var tooltip = this.props.tooltip ? (<Tooltip/>) : null;
        var label = this.props.label ? (<LabelList dataKey="percent" position="inside" fill="#ffffff"/>) : null;
        return (
            <div ref={this.myRef} style={{width: this.state.width, height: this.state.height}}>
                <PieChart width={this.state.pixelWidth} height={this.state.pixelHeight} margin={{top: 20, right: 20, bottom: 20, left: 20}}>
                    <Pie startAngle={180} endAngle={0} innerRadius={40} outerRadius={80} data={this.state.data} nameKey="name" dataKey="value" label>
                        {this.state.data.map((entry, index) => <Cell key={index} fill={this.props.colors[index % this.props.colors.length]}/>)}
                        {label}
                    </Pie>
                    {tooltip}
                    {legend}
                </PieChart>
            </div>
        );
    }
}

HalfPieGraph.propTypes = {
    data: PropTypes.array.isRequired
}

HalfPieGraph.defaultProps = {
    width: "100%",
	height: "100%",
    label: false,
    legend: true,
    tooltip: true,
    colors: COLORS
};

export default HalfPieGraph;