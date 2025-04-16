import {Component, OnInit} from '@angular/core';
import {DashboardSidebarComponent} from "../../Template/dashboard-sidebar/dashboard-sidebar.component";
import {DashboardTopmenuComponent} from "../../Template/dashboard-topmenu/dashboard-topmenu.component";
import {AuthService} from "../../../services/auth.service";
import {ProfileService} from "../../../services/profile.service";
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgForOf, NgIf, NgSwitch, NgSwitchCase, NgSwitchDefault} from "@angular/common";
import {NgToastService} from "ng-angular-popup";
import {Router} from "@angular/router";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
    selector: 'app-profile',
    imports: [
        DashboardSidebarComponent,
        DashboardTopmenuComponent,
        FormsModule,
        NgIf,
        ReactiveFormsModule,
        NgSwitch,
        NgSwitchCase,
        NgSwitchDefault,
        MatProgressSpinner,
        NgForOf
    ],
    templateUrl: './profile.html',
    styleUrl: './profile.scss'
})
export class Profile implements OnInit{
  profileform! : FormGroup;
  formData = {
    firstName: "",
    lastName: "",
    userName: "",
    email: "",
    broker: "",
    phoneNumber: "",
    city: "",
    address: "",
    postalCode: "",
    role: ""
  };
  changepass_form!: FormGroup;
  chp_form = {
    password: "",
    new_password: "",
    re_password: ""
  }
  protected flag_profile: boolean = false;
  brokers = ['Mobin', 'Pishro', 'Pouyan', 'Khobregan'];
  public constructor(private auth:AuthService, private profile:ProfileService, private fb:FormBuilder, private toast:NgToastService, private router:Router) {
  }

  ngOnInit() {
    let id : number = this.auth.getUserID();
    this.profile.getinfo().subscribe(response => {
      this.formData.firstName = response.firstName;
      this.formData.lastName = response.lastName;
      this.formData.userName = response.userName;
      this.formData.email = response.email;
      this.formData.broker = response.broker;
      this.formData.phoneNumber = response.phoneNumber;
      this.formData.city = response.city;
      this.formData.address = response.address;
      this.formData.postalCode = response.postalCode;
      this.formData.role = response.role;

      this.profileform.controls['firstName'].setValue(response.firstName);
      this.profileform.controls['lastName'].setValue(response.lastName);
      this.profileform.controls['userName'].setValue(response.userName);
      this.profileform.controls['email'].setValue(response.email);
      this.profileform.controls['broker'].setValue(response.broker);
      this.profileform.controls['phoneNumber'].setValue(response.phoneNumber);
      this.profileform.controls['city'].setValue(response.city);
      this.profileform.controls['address'].setValue(response.address);
      this.profileform.controls['postalCode'].setValue(response.postalCode);
      this.profileform.controls['role'].setValue(response.role);
      this.flag_profile = true;
    },error => {
      this.toast.error({detail:"ERROR",summary:"Can't Connect to the Server!",duration:5000, position:'topRight'})
    });

    this.profileform = this.fb.group({
      firstName : ['', Validators.required],
      lastName : ['', Validators.required],
      userName : ['', Validators.required],
      email : ['', Validators.required],
      broker: ['', Validators.required],
      phoneNumber : [''],
      city : [''],
      address : [''],
      postalCode : [''],
      role : [''],
      password : ['', Validators.required],
    })
    this.changepass_form = this.fb.group({
      password: ['', Validators.required],
      new_password: ['', Validators.required],
      re_password: ['', Validators.required]
    })
  }

  onUpdate(){
    if (this.profileform.valid){
      this.profile.useredit(this.profileform.value).subscribe({
        error:(res=>{
          if (res.status == 200){
            this.toast.success({detail:"SUCCESS",summary:res.error.text,duration:5000, position:'topRight'});
            this.router.navigate(['brokerages']);
          }
          else
            this.toast.error({detail:"ERROR",summary:res.error,duration:5000, position:'topRight'});
        })
      });
    }
    else {
      this.ValidateAllFormFields(this.profileform);
      this.toast.error({detail:"ERROR",summary:"Your Form Is Not Valid!",duration:5000, position:'topRight'});
    }

  }

  onChangePassword(){
    if (this.changepass_form.valid){
      if (this.changepass_form.controls['new_password'].value == this.changepass_form.controls['re_password'].value){
        this.profile.change_password(this.changepass_form.value).subscribe({
          error:(res=>{
            if (res.status == 200){
              this.toast.success({detail:"SUCCESS",summary:res.error.text,duration:5000, position:'topRight'});
              this.router.navigate(['brokerages']);
            }
            else
              this.toast.error({detail:"ERROR",summary:res.error,duration:5000, position:'topRight'});
          })
        });
      }
      else {
        this.toast.error({detail:"ERROR",summary:"The new password and re-password are not the same!",duration:5000, position:'topRight'});
      }
    }
    else {
      this.ValidateAllFormFields(this.changepass_form);
      this.toast.error({detail:"ERROR",summary:"Your Form Is Not Valid!",duration:5000, position:'topRight'});
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
