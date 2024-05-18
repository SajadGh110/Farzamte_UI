import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { IndexComponent } from './components/index/index.component';
import {authGuard, loginCheck} from "./guards/auth.guard";
import {HomeComponent} from "./components/home/home.component";
import {SupportComponent} from "./components/support/support.component";
import {AboutComponent} from "./components/about/about.component";
import {ReportComponent} from "./components/report/report.component";
import {CrmComponent} from "./components/crm/crm.component";
import {CallcenterComponent} from "./components/callcenter/callcenter.component";
import { DashboardComponent } from './components/panel/dashboard/dashboard.component';
import {View360Component} from "./components/panel/view-360/view-360.component";
import {ProfileComponent} from "./components/panel/profile/profile.component";
import {HappyCallComponent} from "./components/panel/happy-call/happy-call.component";
import {CallInComponent} from "./components/panel/call-in/call-in.component";
import {NoticesComponent} from "./components/panel/notices/notices.component";
import {TicketComponent} from "./components/panel/ticket/ticket.component";
import {MarketingComponent} from "./components/panel/marketing/marketing.component";
import {SurveyComponent} from "./components/panel/survey/survey.component";
import {QAComponent} from "./components/panel/q.a/q.a.component";
import {OtherComponent} from "./components/panel/other/other.component";
import {DisorderComponent} from "./components/panel/disorder/disorder.component";
import {AiAnalysisComponent} from "./components/panel/ai-analysis/ai-analysis.component";

const routes: Routes = [
  {path:'', component: IndexComponent,title:'FarzamTE'},
  {path:'home', component: HomeComponent,title:'dashboard'},
  {path:'login', component: LoginComponent,title:'Login' , canActivate:[loginCheck]},
  {path:'support', component: SupportComponent,title:'Support'},
  {path:'about', component: AboutComponent,title:'About'},
  {path:'report', component: ReportComponent,title:'Report'},
  {path:'crm', component: CrmComponent,title:'CRM'},
  {path:'callcenter', component: CallcenterComponent,title:'CallCenter'},
  {path:'register', component: RegisterComponent,title:'Register' ,canActivate:[authGuard]},
  {path:'dashboard', component: DashboardComponent,title:'Dashboard' ,canActivate:[authGuard]},
  {path:'profile',component: ProfileComponent,title:'Profile' , canActivate:[authGuard]},
  {path:'view_360', component: View360Component,title:'360 Degrees' ,canActivate:[authGuard]},
  {path:'happy_call',component: HappyCallComponent,title:'Happy Call' , canActivate:[authGuard]},
  {path:'call_in',component: CallInComponent,title:'Call in' , canActivate:[authGuard]},
  {path:'notices',component: NoticesComponent,title:'Notices' , canActivate:[authGuard]},
  {path:'ticket',component: TicketComponent,title:'Ticket' , canActivate:[authGuard]},
  {path:'marketing',component: MarketingComponent,title:'Marketing' , canActivate:[authGuard]},
  {path:'survey',component: SurveyComponent,title:'Survey' , canActivate:[authGuard]},
  {path:'q_a',component: QAComponent,title:'Q.A' , canActivate:[authGuard]},
  {path:'other',component: OtherComponent,title:'Other' , canActivate:[authGuard]},
  {path:'disorder',component: DisorderComponent,title:'Disorder' , canActivate:[authGuard]},
  {path:'ai_analysis',component: AiAnalysisComponent,title:'Ai Analysis' , canActivate:[authGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
