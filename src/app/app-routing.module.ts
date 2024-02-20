import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { IndexComponent } from './components/index/index.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import {authGuard} from "./guards/auth.guard";
import {HomeComponent} from "./components/home/home.component";
import {SupportComponent} from "./components/support/support.component";
import {AboutComponent} from "./components/about/about.component";
import {ReportComponent} from "./components/report/report.component";
import {CrmComponent} from "./components/crm/crm.component";
import {CallcenterComponent} from "./components/callcenter/callcenter.component";

const routes: Routes = [
  {path:'', component: IndexComponent},
  {path:'home', component: HomeComponent},
  {path:'login', component: LoginComponent},
  {path:'support', component: SupportComponent},
  {path:'about', component: AboutComponent},
  {path:'report', component: ReportComponent},
  {path:'crm', component: CrmComponent},
  {path:'callcenter', component: CallcenterComponent},
  {path:'register', component: RegisterComponent},
  {path:'dashboard', component: DashboardComponent,canActivate:[authGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
