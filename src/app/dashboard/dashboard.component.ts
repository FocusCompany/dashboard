import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import * as Chartist from 'chartist';
import 'chartist-plugin-legend';
import {Dnd, Process, UserWindow} from '../_models/stats';
import {StatsService} from '../_services/stats.service';
import {DevicesService} from '../_services/devices.service';
import {Device} from '../_models/device';
import {CollectionsService} from '../_services/collections.service';
import {Collection} from '../_models/collection';
import * as moment from 'moment';
import 'moment-duration-format';
import {SatDatepickerInputEvent, SatDatepickerRangeValue} from 'saturn-datepicker';
import * as _ from 'lodash';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class DashboardComponent implements OnInit {

    selectedCollections: string;
    selectedDevice = 'ALL';
    collections = [];
    devices = [];
    date = {begin: moment().startOf('day').subtract(7, 'd').toDate(), end: moment().startOf('day').toDate()};
    dndActivations = 0;
    hoursWorked = '0';
    hoursAfk = '0';
    productivityScore = 0;
    overview = 'day';
    dataHeatMap = [];
    isDataActivitySummaryChart = false;
    isDataTimeSpentChart = false;
    isDataProcessChart = false;
    isDataWindowChart = false;
    processName = '';
    windows: Array<UserWindow> = [];

    constructor(private statsService: StatsService, private devicesService: DevicesService,
                private collectionsService: CollectionsService) {
    }

    ngOnInit() {
        this.devicesService.getDevices().subscribe((devices: Array<Device>) => {
            const list = [{name: 'ALL', id: 'ALL'}];
            devices.forEach(obj => {
                list.push({name: obj.devices_name, id: obj.id_devices.toString()});
            });
            this.devices = list;
        });

        this.collectionsService.getCollections().subscribe((collections: Array<Collection>) => {
            const list = [];
            collections.forEach(obj => {
                list.push({name: obj.collections_name, id: obj.id_collections.toString()});
            });
            this.collections = list;
        });

        this.refreshData();
    }

    getWindowOfProcess(processName: string) {
        this.processName = processName;
        if (this.windows) {
            const dataWindowChart = {labels: [], series: []};
            this.windows.forEach((obj: UserWindow) => {
                if (obj.afk === false && obj.process === processName) {
                    const indexProcess = _.indexOf(dataWindowChart.labels, obj.window);
                    if (indexProcess === -1) {
                        dataWindowChart.labels.push(obj.window);
                        dataWindowChart.series.push(moment.duration(moment(obj.end).diff(moment(obj.start))).asMinutes());

                    } else {
                        dataWindowChart.series[indexProcess] += moment.duration(moment(obj.end).diff(moment(obj.start))).asMinutes();
                    }
                    this.isDataWindowChart = true;
                }
            });
            const windowChart = new Chartist.Bar('#windowChart', dataWindowChart, {
                horizontalBars: true,
                distributeSeries: true,
                axisX: {
                    showGrid: true,
                    onlyInteger: true,
                    labelInterpolationFnc: function (value) {
                        return value + ' min';
                    }
                },
                axisY: {
                    showGrid: false,
                    offset: 200
                },
                width: '100%',
                height: dataWindowChart.series.length * 65 + 'px',
            }).on('draw', (data) => {
                if (data.type === 'bar') {
                    data.element.attr({
                        style: 'stroke-width: 30px'
                    });
                }
            });
        }
    }

    updateCharts(dataActivitySummaryChart: any, dataTimeSpentChart: any, dataProcessChart: any) {
        const activitySummaryChart = new Chartist.Pie('#activitySummaryChart', dataActivitySummaryChart, {
            donut: true,
            donutWidth: 40,
            startAngle: 270,
            total: 100,
            showLabel: true,
            width: '100%',
            height: '187px',
        });

        const timeSpentChart = new Chartist.Pie('#timeSpentChart', dataTimeSpentChart, {
            width: '100%',
            height: '187px',
            showLabel: false,
            plugins: [
                Chartist.plugins.legend({
                    position: 'bottom'
                })
            ]
        });

        const processChart = new Chartist.Bar('#processChart', dataProcessChart, {
            horizontalBars: true,
            distributeSeries: true,
            axisX: {
                showGrid: true,
                onlyInteger: true,
                labelInterpolationFnc: function (value) {
                    return value + ' min';
                }
            },
            axisY: {
                showGrid: false,
                offset: 100
            },
            width: '100%',
            height: dataProcessChart.series.length * 65 + 'px',
        }).on('draw', (data) => {
            if (data.type === 'bar') {
                data.element._node.onclick = () => {
                    this.getWindowOfProcess(data.axisY.ticks[data.seriesIndex]);
                };
                data.element.attr({
                    style: 'stroke-width: 30px'
                });
            }
        });
    }

    updateHeatMap(process: Array<Process>) {
        if (process) {
            const dataHeatMap = [];
            process.forEach((obj: Process) => {
                if (obj.afk === false) {
                    const activity: any = {};
                    activity.date = moment(obj.start).format('YYYY-MM-DD');
                    activity.details = {
                        'name': obj.process,
                        'date': moment(obj.start).format('YYYY-MM-DD HH:mm:ss'),
                        'value': moment.duration(moment(obj.end).diff(moment(obj.start))).asSeconds()
                    };
                    dataHeatMap.push(activity);
                }
            });
            dataHeatMap.forEach((data: any) => {
                let addOrNot = true;
                this.dataHeatMap.forEach((obj: any) => {
                    if (obj.date === data.date) {
                        addOrNot = false;
                        obj.total += data.details.value;
                        obj.details.push(data.details);
                    }
                });
                if (addOrNot === true) {
                    this.dataHeatMap.push({'date': data.date, 'total': data.details.value, 'details': [data.details]});
                    addOrNot = false;
                }
            });
        }
    }

    refreshData() {
        this.dataHeatMap = [];
        this.isDataActivitySummaryChart = false;
        this.isDataTimeSpentChart = false;
        this.isDataProcessChart = false;
        this.isDataWindowChart = false;

        const device = this.selectedDevice === 'ALL' ? null : this.selectedDevice;
        this.statsService.getProcess(device, this.selectedCollections, this.date.begin.toISOString(),
            moment(this.date.end).add(1, 'd').toISOString()).subscribe((process: Array<Process>) => {
            this.statsService.getWindow(device, this.selectedCollections, this.date.begin.toISOString(),
                moment(this.date.end).add(1, 'd').toISOString()).subscribe((window: Array<UserWindow>) => {
                    this.windows = window;
            });
            let durationWork = 0, durationAfk = 0;
            const dataTimeSpentChart = {labels: [], series: []};
            const dataProcessChart = {labels: [], series: []};
            const dataActivitySummaryChart = {labels: [], series: []};
            if (process) {
                process.forEach((obj: Process) => {
                    if (obj.afk === false) {
                        durationWork += moment.duration(moment(obj.end).diff(moment(obj.start))).asSeconds();
                        const indexProcess = _.indexOf(dataProcessChart.labels, obj.process);
                        if (indexProcess === -1) {
                            dataProcessChart.labels.push(obj.process);
                            dataTimeSpentChart.labels.push(obj.process);
                            dataProcessChart.series.push(moment.duration(moment(obj.end).diff(moment(obj.start))).asMinutes());
                            dataTimeSpentChart.series.push(moment.duration(moment(obj.end).diff(moment(obj.start))).asMinutes());

                        } else {
                            dataProcessChart.series[indexProcess] += moment.duration(moment(obj.end).diff(moment(obj.start))).asMinutes();
                            dataTimeSpentChart.series[indexProcess] += moment.duration(moment(obj.end).diff(moment(obj.start))).asMinutes();
                        }
                        this.isDataTimeSpentChart = true;
                        this.isDataProcessChart = true;
                    } else if (obj.afk === true) {
                        durationAfk += moment.duration(moment(obj.end).diff(moment(obj.start))).asSeconds()
                    }
                });
            }
            if (durationWork !== 0) {
                dataActivitySummaryChart.labels.push('Work');
                dataActivitySummaryChart.series.push(((durationWork * 100) / (durationWork + durationAfk)));
                this.isDataActivitySummaryChart = true;
            }
            if (durationAfk !== 0) {
                dataActivitySummaryChart.labels.push('Afk');
                dataActivitySummaryChart.series.push(((durationAfk * 100) / (durationWork + durationAfk)));
                this.isDataActivitySummaryChart = true;
            }
            // @ts-ignore
            this.hoursWorked = moment.duration(durationWork, 'seconds').format('HH:mm', {trim: false});
            // @ts-ignore
            this.hoursAfk = moment.duration(durationAfk, 'seconds').format('HH:mm', {trim: false});
            const numberOfDays = moment.duration(moment(this.date.end).add(1, 'd').diff(this.date.begin)).asDays();
            this.productivityScore = (((moment.duration(this.hoursWorked).asMinutes() * 100) / (7 * 60 * numberOfDays)) -
                (moment.duration(this.hoursAfk).asMinutes() + moment.duration(this.hoursWorked).asMinutes()) / 100);
            this.updateHeatMap(process);
            this.updateCharts(dataActivitySummaryChart, dataTimeSpentChart, dataProcessChart);
        });
        this.statsService.getDnd().subscribe((obj: Dnd) => {
            this.dndActivations = obj.Activations;
        });
    }

    dateChange(e: SatDatepickerInputEvent<Date>) {
        this.date = e.value as SatDatepickerRangeValue<Date>;
        this.refreshData();
    }

    collectionChange() {
        this.selectedDevice = 'ALL';
        this.refreshData();
    }

    deviceChange() {
        this.selectedCollections = null;
        this.refreshData();
    }
}
