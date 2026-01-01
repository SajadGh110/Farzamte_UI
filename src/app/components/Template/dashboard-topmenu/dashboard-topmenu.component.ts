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
  isProfileMenuOpen: boolean = false; // متغیر کنترل وضعیت منوی پروفایل

  public constructor(private titleservice: Title, private auth: AuthService) {
  }

  // تغییر نام به setTitle (استاندارد camelCase)
  public setTitle(newtitle: string) {
    this.titleservice.setTitle(newtitle);
  }

  // تغییر نام به getTitle (تا با HTML هماهنگ شود)
  public getTitle(): string {
    return this.titleservice.getTitle();
  }

  public getUserName(): string {
    return this.auth.getUserName();
  }

  // تابع باز و بسته کردن منوی کشویی پروفایل
  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
    // اگر لاجیک خاصی برای باز شدن سایدبار دارید اینجا اضافه کنید
  }

  logout() {
    this.auth.logout();
  }
}