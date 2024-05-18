import { Component } from '@angular/core';
import {DashboardSidebarComponent} from "../../Template/dashboard-sidebar/dashboard-sidebar.component";
import {DashboardTopmenuComponent} from "../../Template/dashboard-topmenu/dashboard-topmenu.component";
import {Title} from "@angular/platform-browser";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    DashboardSidebarComponent,
    DashboardTopmenuComponent
  ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent {
  public constructor(private auth:AuthService) {
  }

  public getUserRole():string{
    return this.auth.getUserRole();
  }
}
