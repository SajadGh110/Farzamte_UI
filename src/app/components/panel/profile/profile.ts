import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators, FormControl, FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AuthService } from "../../../services/auth.service";
import { UserService } from "../../../services/user.service";
import { NgToastService } from "ng-angular-popup";
import { Router } from "@angular/router";
import {DashboardSidebarComponent} from "../../Template/dashboard-sidebar/dashboard-sidebar.component";
import {DashboardTopmenuComponent} from "../../Template/dashboard-topmenu/dashboard-topmenu.component";
import {NgIf} from "@angular/common";
import {MatProgressSpinner} from "@angular/material/progress-spinner";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
  standalone: true,
  imports: [ DashboardSidebarComponent,
    DashboardTopmenuComponent,
    FormsModule,
    NgIf,
    ReactiveFormsModule,
    MatProgressSpinner ]
})
export class Profile implements OnInit {
  profileform!: FormGroup;
  changepass_form!: FormGroup;
  flag_profile: boolean = false;
  formData: any = {};

  constructor(
    private auth: AuthService,
    private userService: UserService,
    private fb: FormBuilder,
    private toast: NgToastService,
    private router: Router
  ) {
    this.initForms();
  }

  private initForms() {
    this.profileform = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: [''],
      city: [''],
      address: [''],
      postalCode: [''],
      password: ['', Validators.required]
    });

    this.changepass_form = this.fb.group({
      password: ['', Validators.required],
      new_password: ['', [Validators.required, Validators.minLength(6)]],
      re_password: ['', Validators.required]
    });
  }

  ngOnInit() {
    this.loadProfile();
  }

  loadProfile() {
    this.userService.getProfile().subscribe({
      next: (response: any) => {
        if (response.success) {
          this.formData = response.data;
          this.profileform.patchValue(response.data);
          this.flag_profile = true;
        } else {
          this.toast.error({ detail: "خطا", summary: response.message || "اطلاعات دریافت نشد" });
        }
      },
      error: (err) => {
        this.toast.error({ detail: "ERROR", summary: "خطا در برقراری ارتباط با سرور" });
        console.error(err);
      }
    });
  }

  onUpdate() {
    if (this.profileform.valid) {
      this.userService.updateProfile(this.profileform.value).subscribe({
        next: (response: any) => {
          if (response.success) {
            this.toast.success({ detail: "موفقیت", summary: response.message, duration: 3000 });
            if(response.data) this.profileform.patchValue(response.data);
          } else {
            this.toast.error({ detail: "خطا", summary: response.message });
          }
        },
        error: (err) => {
          const errorMsg = err.error?.message || "خطا در به‌روزرسانی";
          this.toast.error({ detail: "ERROR", summary: errorMsg });
        }
      });
    } else {
      this.validateAllFormFields(this.profileform);
    }
  }

  onChangePassword() {
    if (this.changepass_form.invalid) {
      this.validateAllFormFields(this.changepass_form);
      return;
    }
    const { new_password, re_password } = this.changepass_form.value;
    if (new_password !== re_password) {
      this.toast.error({ detail: "خطا", summary: "رمز عبور جدید و تکرار آن یکسان نیستند" });
      return;
    }
    this.userService.changePassword(this.changepass_form.value).subscribe({
      next: (response: any) => {
        if (response.success) {
          this.toast.success({ detail: "موفقیت", summary: response.message });
          this.changepass_form.reset(); // پاک کردن فرم پس از موفقیت
        } else {
          this.toast.error({ detail: "خطا", summary: response.message });
        }
      },
      error: (err) => {
        this.toast.error({ detail: "ERROR", summary: err.error?.message || "تغییر رمز انجام نشد" });
      }
    });
  }

  private validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      control?.markAsDirty({ onlySelf: true });
      control?.markAsTouched({ onlySelf: true });
    });
  }
}
