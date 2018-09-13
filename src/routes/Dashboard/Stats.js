import React, { Component } from 'react';

import Grid from '@material-ui/core/Grid';

import PieGraph from './Graphs/PieGraph';
import ColumnGraph from './Graphs/ColumnGraph';
import BarGraph from './Graphs/BarGraph';
import HalfPieGraph from './Graphs/HalfPieGraph';
import CalendarHeatmapGraph from './Graphs/CalendarHeatmapGraph';

import GraphData from './Graphs/GraphData';

import { withStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { callRenewAPI, Toast } from '../../utils';
import { Hidden } from '@material-ui/core';

const styles = theme => ({
    root: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        margin: theme.spacing.unit,
    },
    formControl: {
        margin: theme.spacing.unit,
        paddingRight: theme.spacing.unit * 2,
        minWidth: 120,
        width: '100%',
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2,
    },
});

class Stats extends Component {
    state = {
        devices: [],
        device: 0,

        calendar: [], // Calendar data
        total: [], // Processes data, pie and bar for now
        heatmap: [], // Heatmap data
        summary: [] // Idle vs activity half pie
    }

    componentDidMount() {
		callRenewAPI('/get_devices', null, 'GET', null, true)
		.then(res => {
			this.setState({devices: res.devices, device: res.devices[0].id_devices});
			this.refreshData();
		})
		.catch(err => {
			console.log(err);
			Toast.error("Could not get device list");
		});
    }
    
    refreshData = () => {
        const options = { device: this.state.device, start: 0, end: Math.floor(Date.now() / 1000) };
        GraphData.get('total', options, true).then(t_data => {
            GraphData.get('heatmap', options).then(h_data => {
                GraphData.get('summary', options).then(s_data => {
                    this.setState({ summary: s_data, heatmap: h_data, total: t_data });
                });
            });
        });
    }

    handleChange = event => {
        this.setState({ [event.target.name]: event.target.value });
        this.refreshData();
    };

    render() {
        const { classes } = this.props;

        return (
        <Grid container direction="row" justify="center" alignItems="center" >          
            <Grid item xs={12}>
                <FormControl className={classes.formControl}>
                    <InputLabel htmlFor="age-simple">Device</InputLabel>
                    <Select
                        value={this.state.device}
                        onChange={this.handleChange}
                        inputProps={{
                        name: 'device',
                        id: 'age-simple',
                        }}
                    >
                    { this.state.devices.map(d =>
                        <MenuItem value={d.id_devices}>{d.devices_name}</MenuItem>
                    )}
                    </Select>
                </FormControl>
            </Grid>
            <Hidden mdDown>
                <Grid item xs={12}>
                    <Paper className={classes.root} elevation={1}>
                        <Typography variant="headline" component="h4">
                            Heatmap
                        </Typography>
                        <Typography>
                            { this.state.heatmap.length > 0 ? <CalendarHeatmapGraph data={this.state.heatmap}/> : 'No heatmap data' }
                        </Typography>
                    </Paper>
                </Grid>
            </Hidden>
            <Grid item xs={12} md={4}>
                <Paper className={classes.root} elevation={1}>
                    <Typography variant="headline" component="h4">
                        Total Time Spent
                    </Typography>
                    <Typography>
                        { this.state.total.length > 0 ? <PieGraph data={this.state.total} height="300px"/> : "No total data" }
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
                <Paper className={classes.root} elevation={1}>
                    <Typography variant="headline" component="h4">
                        Activity Summary
                    </Typography>
                    <Typography>
                        { this.state.total.length > 0 ? <HalfPieGraph data={this.state.summary} height="300px"/> : "No summary data" }
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
                <Paper className={classes.root} elevation={1}>
                    <Typography variant="headline" component="h4">
                        Process Activity
                    </Typography>
                    <Typography>
                        { this.state.total.length > 0 ? <ColumnGraph data={this.state.total} height="300px"/> : "No process activity data" }
                    </Typography>
                </Paper>
            </Grid>
            <Grid item xs={12}>
                <Paper className={classes.root} elevation={1}>
                    <Typography variant="headline" component="h4">
                        Process Activity
                    </Typography>
                    <Typography>
                        { this.state.total.length > 0 ? <BarGraph data={this.state.total} height="300px"/> : "No process activity data" }
                    </Typography>
                </Paper>
            </Grid>
        </Grid>
        );
    }
}

export default withStyles(styles)(Stats);