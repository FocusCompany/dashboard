import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminLayoutRoutes } from './admin-layout.routing';
import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { DevicesComponent } from '../../devices/devices.component';
import { FiltersComponent } from '../../filters/filters.component';
import {
  MatButtonModule,
  MatInputModule,
  MatRippleModule,
  MatFormFieldModule,
  MatTooltipModule,
  MatSelectModule, MatDatepickerModule
} from '@angular/material';
import {NgSelectModule} from '@ng-select/ng-select';
import {SatDatepickerModule, SatNativeDateModule} from 'saturn-datepicker';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(AdminLayoutRoutes),
    FormsModule,
    MatButtonModule,
    MatRippleModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    NgSelectModule,
    SatDatepickerModule,
    SatNativeDateModule,
    MatDatepickerModule
  ],
  declarations: [
    DashboardComponent,
    UserProfileComponent,
    DevicesComponent,
    FiltersComponent,
  ]
})

export class AdminLayoutModule {}
