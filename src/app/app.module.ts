import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { IndexComponent } from './components/index/index.component';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { BrokeragesComponent } from './components/panel/brokerages/brokerages.component';
import { NgToastModule } from 'ng-angular-popup';
import { AboutComponent } from './components/about/about.component';
import { SupportComponent } from './components/support/support.component';
import { ReportComponent } from './components/report/report.component';
import { CrmComponent } from './components/crm/crm.component';
import { CallcenterComponent } from './components/callcenter/callcenter.component';
import { HomeComponent } from './components/home/home.component';
import { Footer1Component } from './components/Template/footer1/footer1.component';
import { Menu1Component } from './components/Template/menu1/menu1.component';
import { Menu2Component } from './components/Template/menu2/menu2.component';
import { Footer2Component } from './components/Template/footer2/footer2.component';
import { HeaderComponent } from './components/Template/header/header.component';
import { Note1Component } from './components/Template/note1/note1.component';
import { NotelistComponent } from './components/Template/notelist/notelist.component';
import { Note2Component } from './components/Template/note2/note2.component';
import { Note3Component } from './components/Template/note3/note3.component';
import { Note4Component } from './components/Template/note4/note4.component';
import { SpanspecialComponent } from './components/Template/spanspecial/spanspecial.component';
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {NgxChartsModule} from "@swimlane/ngx-charts";
import {DashboardTopmenuComponent} from "./components/Template/dashboard-topmenu/dashboard-topmenu.component";
import {DashboardSidebarComponent} from "./components/Template/dashboard-sidebar/dashboard-sidebar.component";
import {NgxEchartsModule} from "ngx-echarts";
@NgModule({ declarations: [
        AppComponent,
        LoginComponent,
        RegisterComponent,
        IndexComponent,
        HomeComponent,
        AboutComponent,
        SupportComponent,
        ReportComponent,
        CrmComponent,
        CallcenterComponent,
        Footer1Component,
        Menu2Component,
        Footer2Component,
        HeaderComponent,
        Note1Component,
        NotelistComponent,
        Note2Component,
        Note3Component,
        Note4Component,
        SpanspecialComponent
    ],
    exports: [
        Menu1Component,
        Footer1Component
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        AppRoutingModule,
        ReactiveFormsModule,
        NgToastModule,
        BrowserAnimationsModule,
        NgxChartsModule,
        DashboardTopmenuComponent,
        DashboardSidebarComponent,
        Menu1Component,
        BrokeragesComponent,
        NgxEchartsModule.forRoot({
            echarts: () => import('echarts')
        })], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
