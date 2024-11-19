import { Component } from '@angular/core';
import {Title} from "@angular/platform-browser";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-dashboard-topmenu',
  standalone: true,
  imports: [],
  templateUrl: './dashboard-topmenu.component.html',
  styleUrl: './dashboard-topmenu.component.scss'
})
export class DashboardTopmenuComponent {
  public constructor(private titleservice:Title,private auth:AuthService) {
  }

  public settitle (newtitle: string){
    this.titleservice.setTitle(newtitle);
  }

  public gettitle ():string {
    return this.titleservice.getTitle();
  }

  public getUserName():string{
    return this.auth.getUserName();
  }
}
