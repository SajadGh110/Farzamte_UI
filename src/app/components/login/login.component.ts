import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginform!: FormGroup;
  constructor(private fb: FormBuilder, private auth:AuthService, private router:Router, private toast:NgToastService){}

  ngOnInit(): void {
    this.loginform = this.fb.group({
      username : ['', Validators.required],
      password : ['', Validators.required]
    })
  }

  onLogin(){
    if(this.loginform.valid){
      this.auth.login(this.loginform.value)
      .subscribe({
        next:(res=>{
          this.loginform.reset();
          this.auth.storeToken(res.token);
          if (this.auth.getUserRole() === "Owner" || this.auth.getUserRole() === "Admin")
            this.router.navigate(['brokerages']).then(()=>{location.reload()});
          else
            this.router.navigate(['profile']).then(()=>{location.reload()});
        }),
        error:(res=>{
            this.toast.error({detail:"ERROR",summary:res.error,duration:5000, position:'topRight'});
        })
      });

    } else {
      this.ValidateAllFormFields(this.loginform);
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
