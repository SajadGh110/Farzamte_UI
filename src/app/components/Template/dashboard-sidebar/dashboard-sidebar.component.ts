import {Component,OnInit} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {Title} from "@angular/platform-browser";
import {NgClass, NgIf} from "@angular/common";

@Component({
    selector: 'app-dashboard-sidebar',
    imports: [
        NgClass,
        NgIf
    ],
    templateUrl: './dashboard-sidebar.component.html',
    styleUrl: './dashboard-sidebar.component.scss'
})
export class DashboardSidebarComponent implements OnInit {
  constructor(private auth : AuthService,private title:Title) {}
  protected flag:boolean = false;
  private openSubmenu: string | null = null;

  async ngOnInit() {}

  getTitle():string{
    return this.title.getTitle();
  }
  logout(){
    this.auth.logout();
  }
  getRole():string{
    return this.auth.getUserRole();
  }
  getBroker():string{
    return this.auth.getUserBroker();
  }

  toggleSubmenu(submenu: string) { this.openSubmenu = this.openSubmenu === submenu ? null : submenu; }
  isSubmenuOpen(submenu: string): boolean { return this.openSubmenu === submenu; }
}
