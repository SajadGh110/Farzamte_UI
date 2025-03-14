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
import { BrokeragesComponent } from './components/panel/brokerages/brokerages.component';
import {View360Component} from "./components/panel/view-360/view-360.component";
import {ProfileComponent} from "./components/panel/profile/profile.component";
import {HappyCallComponent} from "./components/panel/happy-call/happy-call.component";
import {IncomingCallComponent} from "./components/panel/incoming-call/incoming-call.component";
import {NoticesComponent} from "./components/panel/notices/notices.component";
import {TicketComponent} from "./components/panel/ticket/ticket.component";
import {MarketingComponent} from "./components/panel/marketing/marketing.component";
import {SurveyComponent} from "./components/panel/survey/survey.component";
import {QAComponent} from "./components/panel/q.a/q.a.component";
import {OtherComponent} from "./components/panel/other/other.component";
import {DisorderComponent} from "./components/panel/disorder/disorder.component";
import {AiAnalysisComponent} from "./components/panel/ai-analysis/ai-analysis.component";
import {BrokerageCmpComponent} from "./components/panel/brokerage-cmp/brokerage-cmp.component";
import {NoticeSMSComponent} from "./components/panel/notices/notice-sms/notice-sms.component";
import {NoticeCallComponent} from "./components/panel/notices/notice-call/notice-call.component";
import {Dev1Component} from "./components/dev1/dev1.component";
import {Pre1Component} from "./components/pre1/pre1.component";
import {Pre2Component} from "./components/pre2/pre2.component";
import {Pre3Component} from "./components/pre3/pre3.component";
import {Pre4Component} from "./components/pre4/pre4.component";
import {Pre5Component} from "./components/pre5/pre5.component";
import {Pre6Component} from "./components/pre6/pre6.component";

const routes: Routes = [
  {path:'', component: IndexComponent,title:'FarzamTE'},
  {path:'home', component: HomeComponent,title:'brokerages'},
  {path:'login', component: LoginComponent,title:'Login' , canActivate:[loginCheck]},
  {path:'support', component: SupportComponent,title:'Support'},
  {path:'about', component: AboutComponent,title:'About'},
  {path:'report', component: ReportComponent,title:'Report'},
  {path:'crm', component: CrmComponent,title:'CRM'},
  {path:'callcenter', component: CallcenterComponent,title:'CallCenter'},
  {path:'register', component: RegisterComponent,title:'Register' ,canActivate:[authGuard]},
  {path:'brokerages', component: BrokeragesComponent,title:'Brokerages' ,canActivate:[authGuard]},
  {path:'brokerages_cmp', component: BrokerageCmpComponent,title:'Brokerages Comparison' ,canActivate:[authGuard]},
  {path:'profile',component: ProfileComponent,title:'Profile' , canActivate:[authGuard]},
  {path:'view_360', component: View360Component,title:'360 Degrees' ,canActivate:[authGuard]},
  {path:'happy_call',component: HappyCallComponent,title:'Happy Call' , canActivate:[authGuard]},
  {path:'call_in',component: IncomingCallComponent,title:'Incoming Call' , canActivate:[authGuard]},
  {path:'notices',component: NoticesComponent,title:'Notices' , canActivate:[authGuard]},
  {path:'notices/sms',component: NoticeSMSComponent,title:'Notices | Message' , canActivate:[authGuard]},
  {path:'notices/call',component: NoticeCallComponent,title:'Notices | Call' , canActivate:[authGuard]},
  {path:'ticket',component: TicketComponent,title:'Ticket' , canActivate:[authGuard]},
  {path:'marketing',component: MarketingComponent,title:'Marketing' , canActivate:[authGuard]},
  {path:'survey',component: SurveyComponent,title:'Survey' , canActivate:[authGuard]},
  {path:'q_a',component: QAComponent,title:'Q.A' , canActivate:[authGuard]},
  {path:'other',component: OtherComponent,title:'Other' , canActivate:[authGuard]},
  {path:'disorder',component: DisorderComponent,title:'Disorder' , canActivate:[authGuard]},
  {path:'ai_analysis',component: AiAnalysisComponent,title:'Ai Analysis' , canActivate:[authGuard]},
  {path:'dev1-111111',component: Dev1Component,title:'Dev1' , canActivate:[authGuard]},
  {path:'pre1',component: Pre1Component,title:'Pre1' , canActivate:[authGuard]},
  {path:'pre2',component: Pre2Component,title:'Pre2' , canActivate:[authGuard]},
  {path:'pre3',component: Pre3Component,title:'Pre3' , canActivate:[authGuard]},
  {path:'pre4',component: Pre4Component,title:'Pre4' , canActivate:[authGuard]},
  {path:'pre5',component: Pre5Component,title:'Pre5' , canActivate:[authGuard]},
  {path:'pre6',component: Pre6Component,title:'Pre6' , canActivate:[authGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
