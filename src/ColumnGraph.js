import React from 'react';
import { BarChart, Bar, XAxis, YAxis } from 'recharts';
import Graph from './Graph';

class ColumnGraph extends Graph {
    render() {
        return (
            <div ref={this.myRef} style={{width: this.state.width, height: this.state.height}}>
                <BarChart width={this.state.pixelWidth} height={this.state.pixelHeight} data={this.state.data} margin={{top: 20, right: 20, bottom: 20, left: 20}}>
                    <XAxis dataKey="process" type="category"/>
                    <YAxis type="number"/>
                    <Bar dataKey="length" fill="#8884d8" />
                </BarChart>
            </div>
        );
    }
}

export default ColumnGraph;