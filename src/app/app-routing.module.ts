import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Login } from './components/login/login';
import { authGuard, loginGuard } from "./guards/auth.guard";
import { Brokerages } from './components/panel/brokerages/brokerages';
import { View360 } from "./components/panel/view-360/view-360";
import { Profile } from "./components/panel/profile/profile";
import { HappyCall } from "./components/panel/happy-call/happy-call";
import { IncomingCall } from "./components/panel/incoming-call/incoming-call";
import { Ticket } from "./components/panel/ticket/ticket";
import { Marketing } from "./components/panel/marketing/marketing";
import { Survey } from "./components/panel/survey/survey";
import { QA } from "./components/panel/q.a/q.a";
import { Other } from "./components/panel/other/other";
import { Disorder } from "./components/panel/disorder/disorder";
import { AiAnalysis } from "./components/panel/ai-analysis/ai-analysis";
import { BrokerageCmp } from "./components/panel/brokerage-cmp/brokerage-cmp";
import { NoticeSms } from "./components/panel/notices/notice-sms/notice-sms";
import { NoticeCall } from "./components/panel/notices/notice-call/notice-call";
import { IncStatsComponent } from "./components/panel/incoming-call/inc-stats/inc-stats.component";
import { BrokerageProfit } from "./components/panel/brokerages/brokerage-profit/brokerage-profit";
import { BrokerageProfitCmpComponent } from "./components/panel/brokerage-cmp/brokerage-profit-cmp/brokerage-profit-cmp.component";
import { UsersComponent } from './components/panel/users/users';
import { Permissions } from "./components/panel/permissions/permissions";
import { OutcallGeneral } from "./components/panel/outcall/outcall-general/outcall-general";
import { OutcallFollowUp } from "./components/panel/outcall/outcall-follow-up/outcall-follow-up";

const routes: Routes = [
  { path: '', redirectTo: '/brokerages', pathMatch: 'full' },
  { path: 'login', component: Login, title: 'Login', canActivate: [loginGuard] },
  { path: 'brokerages', component: Brokerages, title: 'Brokerages', canActivate: [authGuard] },
  { path: 'brokerages/profit', component: BrokerageProfit, title: 'Brokerages | Profit', canActivate: [authGuard] },
  { path: 'brokerages_cmp', component: BrokerageCmp, title: 'Brokerages Comparison', canActivate: [authGuard] },
  { path: 'brokerages_cmp/profit', component: BrokerageProfitCmpComponent, title: 'Brokerages CMP | Profit', canActivate: [authGuard] },
  { path: 'users', component: UsersComponent, title: 'Users', canActivate: [authGuard] },
  { path: 'permissions', component: Permissions, title: 'Permissions', canActivate: [authGuard] },
  { path: 'profile', component: Profile, title: 'Profile', canActivate: [authGuard] },
  { path: 'view_360', component: View360, title: '360 Degrees', canActivate: [authGuard] },
  { path: 'happy_call', component: HappyCall, title: 'Happy Call', canActivate: [authGuard] },
  { path: 'call_in', component: IncomingCall, title: 'Incoming Call', canActivate: [authGuard] },
  { path: 'call_in_stats', component: IncStatsComponent, title: 'Incoming Call | Stats', canActivate: [authGuard] },
  { path: 'notices/sms', component: NoticeSms, title: 'Notices | Message', canActivate: [authGuard] },
  { path: 'notices/call', component: NoticeCall, title: 'Notices | Call', canActivate: [authGuard] },
  { path: 'ticket', component: Ticket, title: 'Ticket', canActivate: [authGuard] },
  { path: 'marketing', component: Marketing, title: 'Marketing', canActivate: [authGuard] },
  { path: 'survey', component: Survey, title: 'Survey', canActivate: [authGuard] },
  { path: 'q_a', component: QA, title: 'Q.A', canActivate: [authGuard] },
  { path: 'other', component: Other, title: 'Other', canActivate: [authGuard] },
  { path: 'disorder', component: Disorder, title: 'Disorder', canActivate: [authGuard] },
  { path: 'ai_analysis', component: AiAnalysis, title: 'Ai Analysis', canActivate: [authGuard] },
  { path: 'call_out/general', component: OutcallGeneral, title: 'Call Out | General', canActivate: [authGuard] },
  { path: 'call_out/followup', component: OutcallFollowUp, title: 'Call Out | FollowUp', canActivate: [authGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
