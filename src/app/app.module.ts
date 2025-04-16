import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Index } from './components/index';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { Brokerages } from './components/panel/brokerages/brokerages';
import { NgToastModule } from 'ng-angular-popup';
import { About } from './components/about/about';
import { Support } from './components/support/support';
import { Report } from './components/report/report';
import { Crm_old } from './components/crm-old/crm_old';
import { Callcenter } from './components/callcenter/callcenter';
import { Home } from './components/home/home';
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
        Login,
        Register,
        Index,
        Home,
        About,
        Support,
        Report,
        Crm_old,
        Callcenter,
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
        Brokerages,
        NgxEchartsModule.forRoot({
            echarts: () => import('echarts')
        })], providers: [provideHttpClient(withInterceptorsFromDi())] })
export class AppModule { }
