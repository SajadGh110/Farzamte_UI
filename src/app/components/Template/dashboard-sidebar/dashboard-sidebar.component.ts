import {Component, EventEmitter, Output, OnInit, Injectable} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {Title} from "@angular/platform-browser";
import {NgClass} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {TimeService} from "../../../services/time.service";

@Component({
  selector: 'app-dashboard-sidebar',
  standalone: true,
    imports: [
        NgClass,
        ReactiveFormsModule
    ],
  templateUrl: './dashboard-sidebar.component.html',
  styleUrl: './dashboard-sidebar.component.scss'
})
export class DashboardSidebarComponent implements OnInit {
  dateform! : FormGroup;
  @Output() formSubmitted = new EventEmitter();
  constructor(private auth : AuthService,private title:Title, private fb:FormBuilder, private TimeService:TimeService) {}
  StartDate:string = this.TimeService.StartDate;
  EndDate:string = this.TimeService.EndDate;

  async ngOnInit() {
    this.dateform = this.fb.group({
      StartDate: [''],
      EndDate: ['']
    });
    this.dateform.controls['StartDate'].setValue(this.StartDate);
    this.dateform.controls['EndDate'].setValue(this.EndDate);
  }

  async onSubmit(){
    this.TimeService.set_Time(this.dateform.controls['StartDate'].value,this.EndDate = this.dateform.controls['EndDate'].value);
    this.formSubmitted.emit();
  }

  getTitle():string{
    return this.title.getTitle();
  }
  logout(){
    this.auth.logout();
  }
}
