import {Component, Input} from '@angular/core';
import {NgIf} from "@angular/common";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-menu',
  imports: [
    NgIf
  ],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {
  menuActive = false;
  @Input() Selected!: string;
  Status:string = "ورود به سیستم";
  Link:string = "/login";
  constructor(private auth:AuthService) {}
  ngOnInit() {
    if (this.auth.isLoggedIn()){
      this.Status = "داشبورد";
      this.Link = "/brokerages";
    }
    else {
      this.Status = "ورود به سیستم";
      this.Link = "/login";
    }
  }
  toggleMenu() {
    this.menuActive = !this.menuActive;
  }
}
