import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
  standalone: false
})
export class Login implements OnInit {
  loginform!: FormGroup;
  showForgotPasswordModal: boolean = false;
  isLoading: boolean = false;
  
  constructor(
    private fb: FormBuilder, 
    private auth: AuthService, 
    private userService: UserService, 
    private router: Router, 
    private toast: NgToastService
  ) {}

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['brokerages']);
    }
    
    this.loginform = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  openForgotPassword() {
    this.showForgotPasswordModal = true;
  }

  closeForgotPassword() {
    this.showForgotPasswordModal = false;
  }

  onLogin() {
    if (this.loginform.valid) {
      this.isLoading = true;
      
      const credentials = {
        userName: this.loginform.value.username,
        password: this.loginform.value.password
      };
      
      this.userService.login(credentials).subscribe({
        next: (response: any) => {
          this.isLoading = false;
          
          // توجه: بسته به ساختار پاسخ API، ممکنه نیاز به تنظیم کنی
          // اگر response مستقیماً data هست:
          if (response && response.token) {
            this.auth.storeToken(response.token);
            
            this.loginform.reset();
            
            this.toast.success({ 
              detail: "SUCCESS", 
              summary: response.message || "ورود موفقیت‌آمیز", 
              duration: 3000, 
              position: 'topRight' 
            });
            
            this.checkUserAndNavigate();
          } 
          else if (response.success && response.token) {
            this.auth.storeToken(response.token);
            this.loginform.reset();
            
            this.toast.success({ 
              detail: "SUCCESS", 
              summary: response.message || "ورود موفقیت‌آمیز", 
              duration: 3000, 
              position: 'topRight' 
            });
            
            this.checkUserAndNavigate();
          }
          else {
            this.toast.error({ 
              detail: "ERROR", 
              summary: response.message || "ورود ناموفق", 
              duration: 5000, 
              position: 'topRight' 
            });
          }
        },
        error: (error) => {
          this.isLoading = false;
          
          let errorMessage = "خطا در ارتباط با سرور";
          
          if (error.error?.message) {
            errorMessage = error.error.message;
          } else if (error.status === 401) {
            errorMessage = "نام کاربری یا رمز عبور اشتباه است";
          } else if (error.status === 403) {
            errorMessage = "حساب کاربری غیرفعال است";
          } else if (error.status === 0) {
            errorMessage = "خطا در اتصال به سرور";
          }
          
          this.toast.error({ 
            detail: "ERROR", 
            summary: errorMessage, 
            duration: 5000, 
            position: 'topRight' 
          });
        }
      });

    } else {
      this.ValidateAllFormFields(this.loginform);
      this.toast.error({ 
        detail: "ERROR", 
        summary: "لطفا فرم را کامل پر کنید", 
        duration: 5000, 
        position: 'topRight' 
      });
    }
  }

  private checkUserAndNavigate(): void {
    this.router.navigate(['brokerages']);
  }

  private ValidateAllFormFields(formgroup: FormGroup) {
    Object.keys(formgroup.controls).forEach(field => {
      const control = formgroup.get(field);
      if (control instanceof FormControl) {
        control.markAsDirty({ onlySelf: true });
      } else if (control instanceof FormGroup) {
        this.ValidateAllFormFields(control);
      }
    });
  }

  get username() {
    return this.loginform.get('username');
  }
  
  get password() {
    return this.loginform.get('password');
  }
}