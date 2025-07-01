import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './components/login/login';
import { Register } from './components/register/register';
import { Index } from './components/index';
import {authGuard, loginCheck} from "./guards/auth.guard";
import {Support} from "./components/support/support";
import {About} from "./components/about/about";
import {Brokerages} from './components/panel/brokerages/brokerages';
import {View360} from "./components/panel/view-360/view-360";
import {Profile} from "./components/panel/profile/profile";
import {HappyCall} from "./components/panel/happy-call/happy-call";
import {IncomingCall} from "./components/panel/incoming-call/incoming-call";
import {Notices} from "./components/panel/notices/notices";
import {Ticket} from "./components/panel/ticket/ticket";
import {Marketing} from "./components/panel/marketing/marketing";
import {Survey} from "./components/panel/survey/survey";
import {QA} from "./components/panel/q.a/q.a";
import {Other} from "./components/panel/other/other";
import {Disorder} from "./components/panel/disorder/disorder";
import {AiAnalysis} from "./components/panel/ai-analysis/ai-analysis";
import {BrokerageCmp} from "./components/panel/brokerage-cmp/brokerage-cmp";
import {NoticeSms} from "./components/panel/notices/notice-sms/notice-sms";
import {NoticeCall} from "./components/panel/notices/notice-call/notice-call";
import {Crm} from "./components/crm/crm";
import {CrmApproaches} from "./components/crm-approaches/crm-approaches";
import {WhatCrmIsNot} from "./components/what-crm-is-not/what-crm-is-not";
import {WhyNeedCrm} from "./components/why-need-crm/why-need-crm";
import {SomeServices} from "./components/some-services/some-services";
import {FarzamteFeatures} from "./components/farzamte-features/farzamte-features";
import {IncStatsComponent} from "./components/panel/incoming-call/inc-stats/inc-stats.component";

const routes: Routes = [
  {path:'', component: Index,title:'FarzamTE'},
  {path:'login', component: Login,title:'Login' , canActivate:[loginCheck]},
  {path:'register', component: Register,title:'Register' ,canActivate:[authGuard]},
  {path:'support', component: Support,title:'Support'},
  {path:'about', component: About,title:'About'},
  {path:'crm',component: Crm,title:'مدیریت ارتباط با مشتریان'},
  {path:'crm_approaches',component: CrmApproaches,title:'رویکرد های CRM'},
  {path:'what_crm_is_not',component: WhatCrmIsNot,title:'سی‌آر‌ام چه چیزی نیست ؟'},
  {path:'why_need_crm',component: WhyNeedCrm,title:'چرا به crm نیاز داریم ؟'},
  {path:'some_services',component: SomeServices,title:'برخی از خدمات'},
  {path:'farzamte_features',component: FarzamteFeatures,title:'ویژگی های Farzamte'},
  {path:'brokerages', component: Brokerages,title:'Brokerages' ,canActivate:[authGuard]},
  {path:'brokerages_cmp', component: BrokerageCmp,title:'Brokerages Comparison' ,canActivate:[authGuard]},
  {path:'profile',component: Profile,title:'Profile' , canActivate:[authGuard]},
  {path:'view_360', component: View360,title:'360 Degrees' ,canActivate:[authGuard]},
  {path:'happy_call',component: HappyCall,title:'Happy Call' , canActivate:[authGuard]},
  {path:'call_in',component: IncomingCall,title:'Incoming Call' , canActivate:[authGuard]},
  {path:'call_in_stats',component: IncStatsComponent,title:'Incoming Call | Stats' , canActivate:[authGuard]},
  {path:'notices',component: Notices,title:'Notices' , canActivate:[authGuard]},
  {path:'notices/sms',component: NoticeSms,title:'Notices | Message' , canActivate:[authGuard]},
  {path:'notices/call',component: NoticeCall,title:'Notices | Call' , canActivate:[authGuard]},
  {path:'ticket',component: Ticket,title:'Ticket' , canActivate:[authGuard]},
  {path:'marketing',component: Marketing,title:'Marketing' , canActivate:[authGuard]},
  {path:'survey',component: Survey,title:'Survey' , canActivate:[authGuard]},
  {path:'q_a',component: QA,title:'Q.A' , canActivate:[authGuard]},
  {path:'other',component: Other,title:'Other' , canActivate:[authGuard]},
  {path:'disorder',component: Disorder,title:'Disorder' , canActivate:[authGuard]},
  {path:'ai_analysis',component: AiAnalysis,title:'Ai Analysis' , canActivate:[authGuard]}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
