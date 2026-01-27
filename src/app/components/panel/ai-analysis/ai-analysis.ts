import {Component, OnInit} from '@angular/core';
import {DashboardSidebarComponent} from "../../Template/dashboard-sidebar/dashboard-sidebar.component";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";
import {NgToastService} from "ng-angular-popup";

@Component({
    selector: 'app-ai-analysis',
    imports: [
        DashboardSidebarComponent,
    ],
    templateUrl: './ai-analysis.html',
    styleUrl: './ai-analysis.scss'
})
export class AiAnalysis implements OnInit {
  public constructor(private auth:AuthService, private router:Router, private toast:NgToastService) {}
  async ngOnInit() {
    
  }
}
