import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../services/auth.service";

@Component({
    selector: 'app-index',
    templateUrl: './index.html',
    styleUrls: ['./index.scss'],
    standalone: false
})
export class Index implements OnInit {
  Status:string = "Sign In";
  Link:string = "/login";
  constructor(private auth:AuthService) {}
  ngOnInit() {
    if (this.auth.isLoggedIn()){
      this.Status = "Dashboard";
      this.Link = "/brokerages";
    }
    else {
      this.Status = "Sign In";
      this.Link = "/login";
    }
  }
}
