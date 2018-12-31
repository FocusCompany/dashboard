import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {BrowserModule} from '@angular/platform-browser';
import {Routes, RouterModule} from '@angular/router';

import {AdminLayoutComponent} from './layouts/admin-layout/admin-layout.component';
import {AuthGuard} from './_guards/auth.guard';
import {LoginComponent} from './login/login.component';
import { LogoutComponent } from './logout/logout.component';
import {RegisterComponent} from './register/register.component';

const routes: Routes = [
    {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
    },
    {
        path: '',
        component: AdminLayoutComponent,
        canActivate: [AuthGuard],
        children: [
            {
                path: '',
                loadChildren: './layouts/admin-layout/admin-layout.module#AdminLayoutModule'
            }
        ]
    },
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'logout', component: LogoutComponent },
    { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
    imports: [
        CommonModule,
        BrowserModule,
        RouterModule.forRoot(routes)
    ],
    exports: [],
})
export class AppRoutingModule {
}
