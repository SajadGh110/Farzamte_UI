import {Component, EventEmitter, Output, OnInit, Injectable} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import {Title} from "@angular/platform-browser";
import {NgClass, NgIf} from "@angular/common";
import {FormBuilder, FormGroup, ReactiveFormsModule} from "@angular/forms";
import {TimeService} from "../../../services/time.service";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-dashboard-sidebar',
  standalone: true,
  imports: [
    NgClass,
    ReactiveFormsModule,
    MatProgressSpinner,
    NgIf
  ],
  templateUrl: './dashboard-sidebar.component.html',
  styleUrl: './dashboard-sidebar.component.scss'
})
export class DashboardSidebarComponent implements OnInit {
  dateform! : FormGroup;
  @Output() formSubmitted = new EventEmitter();
  constructor(private auth : AuthService,private title:Title, private fb:FormBuilder, private TimeService:TimeService) {}
  StartDate:string = '';
  EndDate:string = '';
  protected flag:boolean = false;

  async ngOnInit() {
    this.dateform = this.fb.group({
      StartDate: [''],
      EndDate: ['']
    });
    if (this.getTitle() == 'Happy Call'){
      let HappyCall_Date = await this.TimeService.get_HappyCall_Date(30);
      this.StartDate = HappyCall_Date[0];
      this.EndDate = HappyCall_Date[1];
    }
    this.flag = true;
    this.dateform.controls['StartDate'].setValue(this.StartDate);
    this.dateform.controls['EndDate'].setValue(this.EndDate);
    await this.onSubmit();
  }

  async onSubmit(){
    this.TimeService.set_Time(this.dateform.controls['StartDate'].value,this.dateform.controls['EndDate'].value);
    this.formSubmitted.emit();
  }

  async SetTime(time:number){
    if (this.getTitle() == 'Happy Call'){
      let HappyCall_Date = await this.TimeService.get_HappyCall_Date(time);
      this.StartDate = HappyCall_Date[0];
      this.EndDate = HappyCall_Date[1];
    }
    this.flag = true;
    this.dateform.controls['StartDate'].setValue(this.StartDate);
    this.dateform.controls['EndDate'].setValue(this.EndDate);
    await this.onSubmit();
  }

  getTitle():string{
    return this.title.getTitle();
  }
  logout(){
    this.auth.logout();
  }
}
