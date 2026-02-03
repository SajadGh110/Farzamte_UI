import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { NgToastService } from 'ng-angular-popup';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from 'src/app/services/user.service';
import { PermissionsService } from "../../services/permissions.service";


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
    private permissionService: PermissionsService,
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

      // مرحله ۱: ارسال درخواست لاگین
      this.userService.login(credentials).subscribe({
        next: (response: any) => {
          // چک کردن وجود توکن در پاسخ سرور
          if (response && response.token) {
            // مرحله ۲: ذخیره توکن و دیکود کردن اطلاعات کاربر
            this.auth.storeToken(response.token);

            const userId = this.auth.getUserId();

            if (userId) {
              // مرحله ۳: دریافت پرمیشن‌ها بر اساس آیدی کاربر
              this.permissionService.GetUserPermissions(userId).subscribe({
                next: (perms) => {
                  // مرحله ۴: ذخیره پرمیشن‌ها در LocalStorage
                  this.auth.storePermissions(perms);

                  // مرحله ۵: نمایش پیام موفقیت و انتقال به صفحه بعد
                  this.handleSuccessLogin(response.message);
                },
                error: (err) => {
                  console.error("خطا در دریافت پرمیشن‌ها", err);
                  // حتی اگر پرمیشن لود نشد، کاربر را وارد می‌کنیم تا اپلیکیشن متوقف نشود
                  this.handleSuccessLogin(response.message);
                }
              });
            } else {
              this.handleSuccessLogin(response.message);
            }
          } else {
            this.isLoading = false;
            this.toast.error({ detail: "خطا", summary: "پاسخ معتبری از سرور دریافت نشد", duration: 5000 });
          }
        },
        error: (error) => {
          this.isLoading = false;
          this.handleLoginError(error);
        }
      });

    } else {
      this.ValidateAllFormFields(this.loginform);
      this.toast.error({ detail: "خطا", summary: "لطفا فرم را کامل پر کنید", duration: 5000 });
    }
  }

// متد کمکی برای مدیریت خروج موفق (جلوگیری از تکرار کد)
  private handleSuccessLogin(msg: string) {
    this.isLoading = false;
    this.loginform.reset();
    this.toast.success({
      detail: "ورود موفق",
      summary: msg || "خوش آمدید",
      duration: 3000,
      position: 'topRight'
    });
    this.router.navigate(['brokerages']);
  }

// متد کمکی برای مدیریت خطاهای لاگین
  private handleLoginError(error: any) {
    let errorMessage = "خطا در ارتباط با سرور";
    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.status === 401) {
      errorMessage = "نام کاربری یا رمز عبور اشتباه است";
    }
    this.toast.error({ detail: "خطا", summary: errorMessage, duration: 5000, position: 'topRight' });
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
