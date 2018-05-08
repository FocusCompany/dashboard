import React from 'react';
import { PieChart, Pie, Cell, Legend, Tooltip, LabelList } from 'recharts';
import PropTypes from 'prop-types';
import Graph from './Graph';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

class HalfPieGraph extends Graph {
    render() {
        var label = this.props.label ? (<LabelList dataKey="process" position="inside" fill="#ffffff"/>) : null;
        return (
            <div ref={this.myRef} style={{width: this.state.width, height: this.state.height}}>
                <PieChart width={this.state.pixelWidth} height={this.state.pixelHeight} margin={{top: 20, right: 20, bottom: 20, left: 20}}>
                    <Pie startAngle={180} endAngle={0} data={this.state.data} nameKey="process" dataKey="length">
                        {this.state.data.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]}/>)}
                        {label}
                    </Pie>
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
    label: true,
    colors: COLORS
};

export default HalfPieGraph;