import React from 'react';
import { ComposedChart, Bar, XAxis, YAxis } from 'recharts';
import Graph from './Graph';

class BarGraph extends Graph {
    render() {
        return (
            <div ref={this.myRef} style={{width: this.state.width, height: this.state.height}}>
                <ComposedChart layout="vertical" width={this.state.pixelWidth} height={this.state.pixelHeight} data={this.state.data} margin={{top: 20, right: 20, bottom: 20, left: 20}}>
                    <XAxis type="number"/>
                    <YAxis dataKey="process" type="category"/>
                    <Bar dataKey="length" fill="#8884d8" />
                </ComposedChart>
            </div>
        );
    }
}

export default BarGraph;