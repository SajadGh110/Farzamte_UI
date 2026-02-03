import { Component } from '@angular/core';
import { Title } from "@angular/platform-browser";
import { AuthService } from "../../../services/auth.service";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dashboard-topmenu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard-topmenu.component.html',
  styleUrls: ['./dashboard-topmenu.component.scss']
})
export class DashboardTopmenuComponent {

  isSidebarOpen: boolean = false;
  isProfileMenuOpen: boolean = false;

  public constructor(private titleservice: Title, private auth: AuthService) {
  }

  public setTitle(newtitle: string) {
    this.titleservice.setTitle(newtitle);
  }

  public getTitle(): string {
    return this.titleservice.getTitle();
  }

  public getUserName(): string | null {
    return this.auth.getUserName();
  }

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout() {
    this.auth.logout();
  }
}
