import {Component, OnInit} from '@angular/core';
import {DashboardSidebarComponent} from "../../Template/dashboard-sidebar/dashboard-sidebar.component";
import {NgToastService} from "ng-angular-popup";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";

@Component({
    selector: 'app-survey',
    imports: [
        DashboardSidebarComponent,
    ],
    templateUrl: './survey.html',
    styleUrl: './survey.scss'
})
export class Survey implements OnInit {
  public constructor(private toast:NgToastService, private auth:AuthService, private router:Router, private fb:FormBuilder) {}
  async ngOnInit() {
    
  }
}
