import { Routes } from '@angular/router';

import { DashboardComponent } from '../../dashboard/dashboard.component';
import { UserProfileComponent } from '../../user-profile/user-profile.component';
import { DevicesComponent } from '../../devices/devices.component';
import { FiltersComponent } from '../../filters/filters.component';

export const AdminLayoutRoutes: Routes = [
    { path: 'dashboard',      component: DashboardComponent },
    { path: 'user-profile',   component: UserProfileComponent },
    { path: 'devices',        component: DevicesComponent },
    { path: 'filters',          component: FiltersComponent },
];
