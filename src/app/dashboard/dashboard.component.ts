import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import * as Chartist from 'chartist';
import 'chartist-plugin-legend';
import {Dnd, Process} from '../_models/stats';
import {StatsService} from '../_services/stats.service';
import {NgSelectModule} from '@ng-select/ng-select';
import {DevicesService} from '../_services/devices.service';
import {Device} from '../_models/device';
import {CollectionsService} from '../_services/collections.service';
import {Collection} from '../_models/collection';
import * as moment from 'moment';
import {SatDatepickerInputEvent, SatDatepickerRangeValue} from 'saturn-datepicker';

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
    timeLastUpdate = 0;

    dataHeatMap = [{
        'date': '2016-01-01',
        'total': 17164,
        'details': [{
            'name': 'Project 1',
            'date': '2016-01-01 12:30:45',
            'value': 9192
        }, {
            'name': 'Project 2',
            'date': '2016-01-01 13:37:00',
            'value': 6753
        },
            {
                'name': 'Project N',
                'date': '2016-01-01 17:52:41',
                'value': 1219
            }]
    }];

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

    updateCharts(dataActivitySummaryChart: any, dataTimeSpentChart: any, dataBarChart: any) {
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

        const barChart = new Chartist.Bar('#barChart', dataBarChart, {
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
            height: dataBarChart.series.length * 45 + 'px',
        }).on('draw', function (data) {
            if (data.type === 'bar') {
                data.element.attr({
                    style: 'stroke-width: 30px'
                });
            }
        });

    }

    refreshData() {
        const device = this.selectedDevice === 'ALL' ? null : this.selectedDevice;
        this.statsService.getProcess(device, this.selectedCollections, this.date.begin.toISOString(),
            moment(this.date.end).add(1, 'd').toISOString()).subscribe((process: Array<Process>) => {
            let durationWork = 0, durationAfk = 0;
            const dataTimeSpentChart = {labels: [], series: []};
            const dataBarChart = {labels: [], series: []};
            const dataActivitySummaryChart = {labels: [], series: []};
            if (process) {
                process.forEach((obj: Process) => {
                    if (obj.afk === false) {
                        durationWork += moment.duration(moment(obj.end).diff(moment(obj.start))).asSeconds();
                        dataBarChart.labels.push(obj.process);
                        dataBarChart.series.push(moment.duration(moment(obj.end).diff(moment(obj.start))).asMinutes());
                        dataTimeSpentChart.labels.push(obj.process);
                        dataTimeSpentChart.series.push(moment.duration(moment(obj.end).diff(moment(obj.start))).asMinutes());
                    } else if (obj.afk === true) {
                        durationAfk += moment.duration(moment(obj.end).diff(moment(obj.start))).asSeconds()
                    }
                });
            }
            if (durationWork !== 0) {
                dataActivitySummaryChart.labels.push('Work');
                dataActivitySummaryChart.series.push(((durationWork * 100) / (durationWork + durationAfk)));
            }
            if (durationAfk !== 0) {
                dataActivitySummaryChart.labels.push('Afk');
                dataActivitySummaryChart.series.push(((durationAfk * 100) / (durationWork + durationAfk)));
            }
            this.hoursWorked = moment.utc(durationWork * 1000).format('HH:mm');
            this.hoursAfk = moment.utc(durationAfk * 1000).format('HH:mm');
            const numberOfDays = moment.duration(moment(this.date.end).add(1, 'd').diff(this.date.begin)).asDays();
            this.productivityScore = (((moment.duration(this.hoursWorked).asMinutes() * 100) / (7 * 60 * numberOfDays)) -
                (moment.duration(this.hoursAfk).asMinutes() + moment.duration(this.hoursWorked).asMinutes()) / 100);
            this.updateCharts(dataActivitySummaryChart, dataTimeSpentChart, dataBarChart);
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
