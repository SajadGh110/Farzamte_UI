import { Component } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgToastService} from "ng-angular-popup";
import emailjs from "@emailjs/browser";

@Component({
    selector: 'app-dashboard-contact',
    imports: [
        ReactiveFormsModule
    ],
    templateUrl: './dashboard-contact.component.html',
    styleUrl: './dashboard-contact.component.scss'
})
export class DashboardContactComponent {
  contactform!:FormGroup;
  constructor(private fb:FormBuilder,private toast:NgToastService) {}

  ngOnInit(): void {
    this.contactform = this.fb.group({
      name: ['', Validators.required],
      text: ['', Validators.required],
    })
  }

  async send(){
    if(this.contactform.valid){
      emailjs.init('LJ2ENj7qErcphFqsb')
      let response = await emailjs.send("service_r44wl6m","template_1qfw6zo",this.contactform.value);
      this.toast.success({detail:"SUCCESS",summary:"پیام شما با موفقیت ارسال شد!",duration:5000, position:'topRight'});
      this.ngOnInit();
    }
    else {
      this.ValidateAllFormFields(this.contactform);
      this.toast.error({detail:"خطا",summary:"لطفا موارد خواسته شده را تکمیل بفرمایید!",duration:5000, position:'topRight'});
    }
  }

  private ValidateAllFormFields(formgroup: FormGroup){
    Object.keys(formgroup.controls).forEach(field => {
      const control = formgroup.get(field);
      if(control instanceof FormControl){
        control.markAsDirty({ onlySelf: true });
      } else if(control instanceof FormGroup){
        this.ValidateAllFormFields(control);
      }
    })
  }
}
