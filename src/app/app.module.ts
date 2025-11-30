import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Login } from './components/login/login';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { Brokerages } from './components/panel/brokerages/brokerages';
import { NgToastModule } from 'ng-angular-popup';
import { Footer1Component } from './components/Template/footer1/footer1.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatNativeDateModule} from '@angular/material/core';
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {DashboardTopmenuComponent} from "./components/Template/dashboard-topmenu/dashboard-topmenu.component";
import {DashboardSidebarComponent} from "./components/Template/dashboard-sidebar/dashboard-sidebar.component";
import {NgxEchartsModule} from "ngx-echarts";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MenuTitle} from "./components/Template/menu-title/menu-title";
@NgModule({ declarations: [
        AppComponent,
        Login,
        Footer1Component
    ],
    exports: [
        Footer1Component
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        NgToastModule,
        BrowserAnimationsModule,
        MatNativeDateModule,
        NgxChartsModule,
        MatDatepickerModule,
        DashboardTopmenuComponent,
        DashboardSidebarComponent,
        Brokerages,
        NgxEchartsModule.forRoot({
            echarts: () => import('echarts')
        }), MenuTitle], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
