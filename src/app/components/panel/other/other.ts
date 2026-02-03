import {Component, OnInit} from '@angular/core';
import {DashboardSidebarComponent} from "../../Template/dashboard-sidebar/dashboard-sidebar.component";
import {NgToastService} from "ng-angular-popup";
import {AuthService} from "../../../services/auth.service";
import {Router} from "@angular/router";
import {FormBuilder} from "@angular/forms";
import {DashboardTopmenuComponent} from "../../Template/dashboard-topmenu/dashboard-topmenu.component";

@Component({
    selector: 'app-other',
  imports: [
    DashboardSidebarComponent,
    DashboardTopmenuComponent,
  ],
    templateUrl: './other.html',
    styleUrl: './other.scss'
})
export class Other implements OnInit {
  public constructor(private toast:NgToastService, private auth:AuthService, private router:Router, private fb:FormBuilder) {}
  async ngOnInit() {

  }
}
