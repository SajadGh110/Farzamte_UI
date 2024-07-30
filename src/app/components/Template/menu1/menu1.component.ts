import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-menu1',
  standalone: true,
  templateUrl: './menu1.component.html',
  styleUrls: ['./menu1.component.scss']
})
export class Menu1Component implements OnInit{
  Status:string = "Sign In";
  Link:string = "/login";
  constructor(private auth:AuthService) {}
  ngOnInit() {
    if (this.auth.isLoggedIn()){
      this.Status = "Dashboard";
      this.Link = "/dashboard";
    }
    else {
      this.Status = "Sign In";
      this.Link = "/login";
    }
  }
}
