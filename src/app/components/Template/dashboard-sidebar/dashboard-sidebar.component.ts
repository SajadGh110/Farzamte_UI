import { Component } from '@angular/core';
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-dashboard-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './dashboard-sidebar.component.html',
  styleUrl: './dashboard-sidebar.component.scss'
})
export class DashboardSidebarComponent {
  constructor(private auth : AuthService) {
  }

  logout(){
    this.auth.logout();
  }
}
