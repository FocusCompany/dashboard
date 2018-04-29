'use strict';

import React, { Component } from 'react';
import './Util';

export class BarChart extends React.Component {
    constructor(props) {
        super(props);

        if ('width' in props) {
            var width = props.width;
        } else {
            var width = 420;
        }
        if ('barHeight' in props) {
            var barHeight = props.barHeight;
        } else {
            var barHeight = 20;
        }
        var axisName = props.name + "Axis"
        this.state = {width: width, barHeight: barHeight, svg: <svg id="svg1" className={props.name} width={width}/>};
    }
 
    componentDidMount() {
        this.createGraph();
    }
 
    createGraph() {
        var width = parseFloat(d3.select("." + this.props.name).style('width'));
        var barHeight = this.state.barHeight;
        var activities = [];
        var values = [];
        for (var o in this.props.data) {
            activities.push({"name": o, "duration": this.props.data[o]["duration"]});
            values.push(this.props.data[o]["duration"]);
        }
        var max = Math.max(...values);
        var chart = d3.select("." + this.props.name).attr("width", width).attr("height", barHeight * (activities.length + 1)).attr("overflow", "visible").attr("overflow-y", "scroll");
        var x = d3.scale.linear().domain([0, max]).nice().range([0, width]);
        var bar = chart.selectAll("g").data(activities).enter().append("g").attr("transform", function(d, i) { return "translate(0," + i * barHeight + ")"; }).attr("text-anchor", function(d, i) { var value = x(d.duration); if (value < width / 2) {return "start";} else {return "end";} });
        bar.append("rect").attr("width", function(d) { return x(d.duration); }).attr("height", barHeight - 1);
        bar.append("text").attr("x", function(d) { var value = x(d.duration); if (value < width / 2) {return value + 5;} else {return value - 5;} }).attr("y", barHeight / 2).attr("dy", ".35em").attr("text-anchor", "inherit").text(function(d) { return d.name; });

        var axisScale = d3.scale.linear().domain([0, max]).nice().range([0, width]);
        var xAxis = d3.svg.axis().scale(axisScale);
        chart.append("g").attr("transform", "translate(0," + barHeight * activities.length + ")").call(xAxis);
    }
 
    render() {
        return(this.state.svg);
    }
}

export class GraphJS extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        var labels = [];
        var data = [];

        for (var o in this.props.data) {
            labels.push(o);
            data.push(this.props.data[o].duration);
        }

        var ctx = document.getElementById('myChart').getContext('2d');
        var chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'bar',

            // The data for our dataset
            data: {
                labels: labels,
                datasets: [{
                    label: "Time spent (seconds)",
                    backgroundColor: 'rgb(255, 99, 132)',
                    borderColor: 'rgb(255, 99, 132)',
                    data: data,
                }]
            },

            // Configuration options go here
            options: {
                scales: {
                    xAxes: [{
                        ticks: {
                            maxRotation: 90
                        }
                    }]
                }
            }
        });
    }

    render() {
        return (<canvas id="myChart" width="100%" height="100%"></canvas>);
    }
}