import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {AppRoutingModule} from './app.routing';
import {ComponentsModule} from './components/components.module';
import {AppComponent} from './app.component';
import { LogoutComponent } from './logout/logout.component';
import {AdminLayoutComponent} from './layouts/admin-layout/admin-layout.component';
import {StatsService} from './_services/stats.service';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {LoginComponent} from './login/login.component';
import {AlertComponent} from './_directives/alert.component';
import {AuthGuard} from './_guards/auth.guard';
import {AlertService} from './_services/alert.service';
import {AuthenticationService} from './_services/authentication.service';
import {UserService} from './_services/user.service';
import {JwtInterceptor} from './_helpers/jwt.interceptor';
import {RegisterComponent} from './register/register.component';
import {DevicesService} from './_services/devices.service';
import {CollectionsService} from './_services/collections.service';
import {FiltersService} from './_services/filters.service';
import { AddDeviceDialogComponent } from './dialog/add-device-dialog/add-device-dialog.component';
import { AddGroupDialogComponent } from './dialog/add-group-dialog/add-group-dialog.component';
import {MatButtonModule, MatCardModule, MatDialogModule, MatIconModule, MatMenuModule, MatTabsModule, MatDatepickerModule,
    MatInputModule, MatListModule, MatPaginatorModule, MatProgressSpinnerModule, MatSelectModule, MatSidenavModule,
    MatSortModule, MatTableModule, MatToolbarModule} from '@angular/material';
import {AddFilterDialogComponent} from './dialog/add-filter-dialog/add-filter-dialog.component';
import {NgSelectModule} from '@ng-select/ng-select';
import {ModifyDeviceDialogComponent} from './dialog/modify-device-dialog/modify-device-dialog.component';
import {UrlInterceptor} from './_helpers/url.interceptor';

@NgModule({
    imports: [
        BrowserAnimationsModule,
        FormsModule,
        HttpClientModule,
        ComponentsModule,
        RouterModule,
        AppRoutingModule,
        MatDialogModule,
        ReactiveFormsModule,
        MatMenuModule,
        MatButtonModule,
        MatIconModule,
        MatCardModule,
        MatTabsModule,
        MatSidenavModule,
        MatListModule,
        MatToolbarModule,
        MatInputModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        MatProgressSpinnerModule,
        MatSelectModule,
        MatDatepickerModule,
        NgSelectModule
    ],
    declarations: [
        AppComponent,
        AdminLayoutComponent,
        LoginComponent,
        LogoutComponent,
        AlertComponent,
        RegisterComponent,
        AddDeviceDialogComponent,
        AddGroupDialogComponent,
        AddFilterDialogComponent,
        ModifyDeviceDialogComponent
    ],
    providers: [
        AuthGuard,
        AlertService,
        AuthenticationService,
        StatsService,
        DevicesService,
        FiltersService,
        CollectionsService,
        UserService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: UrlInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent],
    entryComponents: [
        AddDeviceDialogComponent,
        AddGroupDialogComponent,
        AddFilterDialogComponent,
        ModifyDeviceDialogComponent
    ]
})
export class AppModule {
}
