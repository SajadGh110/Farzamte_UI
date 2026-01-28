import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { Login } from './components/login/login';
import { NgToastModule } from 'ng-angular-popup';
import { Footer1Component } from './components/Template/footer1/footer1.component';
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { MatNativeDateModule } from '@angular/material/core';
import { NgxChartsModule } from "@swimlane/ngx-charts";
import { DashboardTopmenuComponent } from "./components/Template/dashboard-topmenu/dashboard-topmenu.component";
import { DashboardSidebarComponent } from "./components/Template/dashboard-sidebar/dashboard-sidebar.component";
import { NgxEchartsModule } from "ngx-echarts";
import { MatDatepickerModule } from "@angular/material/datepicker";
import { AuthInterceptorService } from './interceptors/auth-interceptor.service';

@NgModule({ 
    declarations: [
        AppComponent,
        Login,
        Footer1Component
    ],
    exports: [
        Footer1Component
    ],
    bootstrap: [AppComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        HttpClientModule,
        ReactiveFormsModule,
        NgToastModule,
        BrowserAnimationsModule,
        MatNativeDateModule,
        NgxChartsModule,
        MatDatepickerModule,
        DashboardTopmenuComponent,
        DashboardSidebarComponent,
        NgxEchartsModule.forRoot({
            echarts: () => import('echarts')
        })
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptorService,
            multi: true
        }
    ]
})
export class AppModule { }