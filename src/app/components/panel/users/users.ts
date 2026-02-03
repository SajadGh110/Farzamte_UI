import { Component, OnInit } from '@angular/core';
import { UserService, User } from '../../../services/user.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgToastService } from "ng-angular-popup";
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import {DashboardTopmenuComponent} from "../../Template/dashboard-topmenu/dashboard-topmenu.component";
import {DashboardSidebarComponent} from "../../Template/dashboard-sidebar/dashboard-sidebar.component";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, MatProgressSpinnerModule, DashboardTopmenuComponent, DashboardSidebarComponent],
  templateUrl: './users.html',
  styleUrl: './users.scss'
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  loading = false;
  showModal: boolean = false;
  isAddMode = false;
  isEditMode = false;
  selectedUser: User | null = null;

  userForm!: FormGroup;
  searchForm!: FormGroup;

  currentPage = 1;
  itemsPerPage = 8;
  totalItems = 0;

  constructor(
    private userService: UserService,
    protected auth: AuthService,
    private fb: FormBuilder,
    private toast: NgToastService
  ) {
    this.initForms();
  }

  private initForms() {
    this.userForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.minLength(6)]],
      firstName: [''],
      lastName: [''],
      email: ['', [Validators.email]],
      phoneNumber: ['']
    });

    this.searchForm = this.fb.group({ searchTerm: [''] });
  }

  ngOnInit(): void {
    if (!this.auth.hasPermission('user.create')) {
      console.warn('دسترسی محدود: ریکوئستی ارسال نشد.');
      return;
    }
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        if (response.success) {
          this.users = response.data;
          this.totalItems = this.users.length;
        } else {
          this.toast.error({ detail: "ERROR", summary: response.message });
        }
        this.loading = false;
      },
      error: (err) => {
        this.toast.error({ detail: "ERROR", summary: "خطا در ارتباط با سرور" });
        this.loading = false;
      }
    });
  }

  searchUsers(): void {
    const term = this.searchForm.get('searchTerm')?.value?.toLowerCase();
    if (!term) {
      this.loadUsers();
      return;
    }
    this.users = this.users.filter(u =>
      u.userName.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) ||
      `${u.firstName} ${u.lastName}`.toLowerCase().includes(term)
    );
    this.totalItems = this.users.length;
    this.currentPage = 1;
  }

  resetSearch() {
    this.searchForm.reset();
    this.loadUsers();
  }

  openAddModal() {
    this.isEditMode = false;
    this.isAddMode = true;
    this.selectedUser = null;
    this.userForm.reset();
    this.showModal = true;
  }

  openEditModal(user: any) {
    this.isEditMode = true;
    this.isAddMode = false;
    this.selectedUser = user;
    this.userForm.patchValue(user);
    this.showModal = true;
  }

  closeModal() {
    this.showModal = false;
  }

  submitForm() {
    if (this.userForm.invalid) return;

    const userData = this.userForm.value;
    this.loading = true;

    if (this.isAddMode) {
      this.userService.createUser(userData).subscribe({
        next: (res) => {
          if(res.success) this.handleSuccess("کاربر با موفقیت ایجاد شد");
          else this.handleError({error: res});
        },
        error: (err) => this.handleError(err)
      });
    } else if (this.isEditMode && this.selectedUser) {
      if (!userData.password) delete userData.password;
      this.userService.updateUser(this.selectedUser.id, userData).subscribe({
        next: (res) => {
          if(res.success) this.handleSuccess("تغییرات با موفقیت ذخیره شد");
          else this.handleError({error: res});
        },
        error: (err) => this.handleError(err)
      });
    }
  }

  toggleUserStatus(user: any, newStatus: boolean) {
    this.loading = true;
    this.userService.toggleUserStatus(user.id, newStatus).subscribe({
      next: (response: any) => {
        if (response.success) {
          user.isActive = newStatus;
          this.toast.success({ detail: "موفقیت", summary: response.message });
        }
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.toast.error({ detail: "خطا", summary: "تغییر وضعیت انجام نشد" });
      }
    });
  }

  deleteUser(id: number) {
    if (confirm("آیا از حذف این کاربر مطمئن هستید؟")) {
      this.userService.deleteUser(id).subscribe({
        next: () => this.handleSuccess("کاربر حذف شد"),
        error: (err) => this.handleError(err)
      });
    }
  }

  private handleSuccess(msg: string) {
    this.toast.success({ detail: "موفقیت", summary: msg });
    this.loadUsers();
    this.closeModal();
  }

  private handleError(err: any) {
    this.loading = false;
    this.toast.error({ detail: "خطا", summary: err.error?.message || "عملیات شکست خورد" });
  }

  get paginatedUsers(): User[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.users.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number { return Math.ceil(this.totalItems / this.itemsPerPage); }

  changePage(p: number) { this.currentPage = p; }

  formatDate(d: any) {
    if (!d || d.startsWith('0001')) return 'ثبت نشده';
    return new Date(d).toLocaleDateString('fa-IR');
  }
}
