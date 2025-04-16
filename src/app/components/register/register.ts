import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AuthService } from 'src/app/services/auth.service';

@Component({
    selector: 'app-register',
    templateUrl: './register.html',
    styleUrls: ['./register.scss'],
    standalone: false
})
export class Register {
  registerform!: FormGroup;
  constructor(private fb: FormBuilder,private auth:AuthService, private router:Router, private toast:NgToastService){}

  ngOnInit(): void {
    this.registerform = this.fb.group({
      username : ['', Validators.required],
      email : ['', Validators.required],
      firstname : ['', Validators.required],
      lastname : ['', Validators.required],
      password : ['', Validators.required]
    })
  }

  onRegister(){
    if(this.registerform.valid){
      this.auth.register(this.registerform.value)
      .subscribe(
        (response) => {
          this.registerform.reset();
          this.toast.success({detail:"SUCCESS",summary:response.message,duration:5000, position:'topRight'});
          this.router.navigate(['login']);
        },
        (error) => {
          if(error.status == 200){
            this.registerform.reset();
            this.toast.success({detail:"SUCCESS",summary:error.error.text,duration:5000, position:'topRight'});
            this.router.navigate(['login']);
          }
          else{
            this.toast.error({detail:"ERROR",summary:error.error,duration:5000, position:'topRight'});
          }
      });

    } else {
      this.ValidateAllFormFields(this.registerform);
      this.toast.error({detail:"ERROR",summary:"Form Is Not Valid!",duration:5000, position:'topRight'});
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
