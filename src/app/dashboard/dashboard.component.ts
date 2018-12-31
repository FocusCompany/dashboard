import {Component, OnInit, ViewChild} from '@angular/core';
import * as Chartist from 'chartist';
import {Process} from '../_models/stats';
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
    styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

    selectedCollections: string;
    selectedDevice = 'ALL';
    collections = [];
    devices = [];
    date = {begin: moment().startOf('day').subtract(7, 'd').toDate(), end: moment().startOf('day').toDate()};

    constructor(private statsService: StatsService, private devicesService: DevicesService,
                private collectionsService: CollectionsService) {
    }

    startAnimationForLineChart(chart) {
        let seq: any, delays: any, durations: any;
        seq = 0;
        delays = 80;
        durations = 500;

        chart.on('draw', function (data) {
            if (data.type === 'line' || data.type === 'area') {
                data.element.animate({
                    d: {
                        begin: 600,
                        dur: 700,
                        from: data.path.clone().scale(1, 0).translate(0, data.chartRect.height()).stringify(),
                        to: data.path.clone().stringify(),
                        easing: Chartist.Svg.Easing.easeOutQuint
                    }
                });
            } else if (data.type === 'point') {
                seq++;
                data.element.animate({
                    opacity: {
                        begin: seq * delays,
                        dur: durations,
                        from: 0,
                        to: 1,
                        easing: 'ease'
                    }
                });
            }
        });

        seq = 0;
    };

    startAnimationForBarChart(chart) {
        let seq2: any, delays2: any, durations2: any;

        seq2 = 0;
        delays2 = 80;
        durations2 = 500;
        chart.on('draw', function (data) {
            if (data.type === 'bar') {
                seq2++;
                data.element.animate({
                    opacity: {
                        begin: seq2 * delays2,
                        dur: durations2,
                        from: 0,
                        to: 1,
                        easing: 'ease'
                    }
                });
            }
        });

        seq2 = 0;
    };

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

        /* ----------==========     Daily Sales Chart initialization For Documentation    ==========---------- */

        const dataDailySalesChart: any = {
            labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
            series: [
                [12, 17, 7, 17, 23, 18, 38]
            ]
        };

        const optionsDailySalesChart: any = {
            lineSmooth: Chartist.Interpolation.cardinal({
                tension: 0
            }),
            low: 0,
            high: 50, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
            chartPadding: {top: 0, right: 0, bottom: 0, left: 0},
        }

        var dailySalesChart = new Chartist.Line('#dailySalesChart', dataDailySalesChart, optionsDailySalesChart);

        this.startAnimationForLineChart(dailySalesChart);


        /* ----------==========     Completed Tasks Chart initialization    ==========---------- */

        const dataCompletedTasksChart: any = {
            labels: ['12p', '3p', '6p', '9p', '12p', '3a', '6a', '9a'],
            series: [
                [230, 750, 450, 300, 280, 240, 200, 190]
            ]
        };

        const optionsCompletedTasksChart: any = {
            lineSmooth: Chartist.Interpolation.cardinal({
                tension: 0
            }),
            low: 0,
            high: 1000, // creative tim: we recommend you to set the high sa the biggest value + something for a better look
            chartPadding: {top: 0, right: 0, bottom: 0, left: 0}
        }

        var completedTasksChart = new Chartist.Line('#completedTasksChart', dataCompletedTasksChart, optionsCompletedTasksChart);

        // start animation for the Completed Tasks Chart - Line Chart
        this.startAnimationForLineChart(completedTasksChart);


        /* ----------==========     Emails Subscription Chart initialization    ==========---------- */

        var datawebsiteViewsChart = {
            labels: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
            series: [
                [542, 443, 320, 780, 553, 453, 326, 434, 568, 610, 756, 895]

            ]
        };
        var optionswebsiteViewsChart = {
            axisX: {
                showGrid: false
            },
            low: 0,
            high: 1000,
            chartPadding: {top: 0, right: 5, bottom: 0, left: 0}
        };
        var responsiveOptions: any[] = [
            ['screen and (max-width: 640px)', {
                seriesBarDistance: 5,
                axisX: {
                    labelInterpolationFnc: function (value) {
                        return value[0];
                    }
                }
            }]
        ];
        var websiteViewsChart = new Chartist.Bar('#websiteViewsChart', datawebsiteViewsChart, optionswebsiteViewsChart, responsiveOptions);

        //start animation for the Emails Subscription Chart
        this.startAnimationForBarChart(websiteViewsChart);
    }

    refreshData() {
        const device = this.selectedDevice === 'ALL' ? null : this.selectedDevice;
        console.log();
        this.statsService.getProcess(device, this.selectedCollections, this.date.begin.toISOString(),
            moment(this.date.end).add(1, 'd').toISOString()).subscribe((process: Array<Process>) => {
            console.log(process);
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
