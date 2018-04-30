import React from 'react';
import { PieChart, Pie, Sector, Cell } from 'recharts';
import Graph from './Graph';

const RADIAN = Math.PI / 180;
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

class PieGraph extends Graph {
    render() {
        const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
            const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);
        
            return (
                <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central">
                    {this.state.data[index].process}
                </text>
            );
        };
        return (
            <div ref={this.myRef} style={{width: this.state.width, height: this.state.height}}>
                <PieChart width={this.state.pixelWidth} height={this.state.pixelHeight} margin={{top: 20, right: 20, bottom: 20, left: 20}}>
                    <Pie data={this.state.data} dataKey="length" labelLine={false} label={renderCustomizedLabel}>
                        {this.state.data.map((entry, index) => <Cell fill={COLORS[index % COLORS.length]}/>)}
                    </Pie>
                </PieChart>
            </div>
        );
    }
}

export default PieGraph;