import { Component, OnInit } from '@angular/core';
import { UserService, User, RegisterUser, UpdateUser } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-users',
  imports: [
      NgIf,
    ],
  templateUrl: './users.html',
  styleUrls: ['./users.scss']
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  loading = false;
  errorMessage = '';
  successMessage = '';
  
  isAddMode = false;
  isEditMode = false;
  selectedUser: User | null = null;
  
  userForm: FormGroup;
  searchForm: FormGroup;
  
  searchTerm = '';
  
  currentPage = 1;
  itemsPerPage = 10;
  totalItems = 0;
  
  constructor(
    private userService: UserService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.userForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      firstName: [''],
      lastName: [''],
      email: ['', [Validators.email]],
      phoneNumber: ['']
    });
    
    this.searchForm = this.fb.group({
      searchTerm: ['']
    });
  }
  
  ngOnInit(): void {
    this.loadUsers();
  }
  
  loadUsers(): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.userService.getAllUsers().subscribe({
      next: (response) => {
        if (response.success && response.data) {
          this.users = response.data;
          this.totalItems = this.users.length;
        } else {
          this.errorMessage = response.message || 'خطا در دریافت کاربران';
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'خطا در ارتباط با سرور';
        this.loading = false;
        console.error('Error loading users:', error);
      }
    });
  }
  
  searchUsers(): void {
    const term = this.searchForm.get('searchTerm')?.value;
    if (!term.trim()) {
      this.loadUsers();
      return;
    }
    
    // فیلتر محلی (می‌توانی API جستجو هم اضافه کنی)
    this.users = this.users.filter(user => 
      user.userName.toLowerCase().includes(term.toLowerCase()) ||
      user.firstName?.toLowerCase().includes(term.toLowerCase()) ||
      user.lastName?.toLowerCase().includes(term.toLowerCase()) ||
      user.email?.toLowerCase().includes(term.toLowerCase())
    );
    this.totalItems = this.users.length;
    this.currentPage = 1;
  }
  
  resetSearch(): void {
    this.searchForm.reset();
    this.loadUsers();
  }
  
  openAddModal(): void {
    this.isAddMode = true;
    this.isEditMode = false;
    this.selectedUser = null;
    this.userForm.reset();
    this.userForm.get('password')?.setValidators([Validators.required, Validators.minLength(6)]);
    this.userForm.get('password')?.updateValueAndValidity();
  }
  
  openEditModal(user: User): void {
    this.isEditMode = true;
    this.isAddMode = false;
    this.selectedUser = user;
    
    this.userForm.patchValue({
      userName: user.userName,
      firstName: user.firstName || '',
      lastName: user.lastName || '',
      email: user.email || '',
      phoneNumber: user.phoneNumber || ''
    });
    
    // در ویرایش، رمز عبور اختیاری است
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
  }
  
  closeModal(): void {
    this.isAddMode = false;
    this.isEditMode = false;
    this.selectedUser = null;
    this.userForm.reset();
  }
  
  submitForm(): void {
    if (this.userForm.invalid) {
      this.markFormGroupTouched(this.userForm);
      return;
    }
    
    const formValue = this.userForm.value;
    
    if (this.isAddMode) {
      this.addUser(formValue);
    } else if (this.isEditMode && this.selectedUser) {
      this.updateUser(this.selectedUser.id, formValue);
    }
  }
  
  addUser(userData: RegisterUser): void {
    this.loading = true;
    this.errorMessage = '';
    
    this.userService.createUser(userData).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = 'کاربر با موفقیت ایجاد شد';
          this.loadUsers();
          this.closeModal();
        } else {
          this.errorMessage = response.message || 'خطا در ایجاد کاربر';
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'خطا در ارتباط با سرور';
        this.loading = false;
        console.error('Error adding user:', error);
      }
    });
  }
  
  updateUser(id: number, updateData: UpdateUser): void {
    this.loading = true;
    this.errorMessage = '';
    
    // اگر رمز عبور خالی است، حذفش کن
    if (!updateData.password) {
      delete updateData.password;
    }
    
    this.userService.updateUser(id, updateData).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = 'کاربر با موفقیت ویرایش شد';
          this.loadUsers();
          this.closeModal();
        } else {
          this.errorMessage = response.message || 'خطا در ویرایش کاربر';
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'خطا در ارتباط با سرور';
        this.loading = false;
        console.error('Error updating user:', error);
      }
    });
  }
  
  deleteUser(id: number): void {
    if (!confirm('آیا از حذف این کاربر اطمینان دارید؟')) {
      return;
    }
    
    this.loading = true;
    this.errorMessage = '';
    
    this.userService.deleteUser(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = 'کاربر با موفقیت حذف شد';
          this.loadUsers();
        } else {
          this.errorMessage = response.message || 'خطا در حذف کاربر';
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'خطا در ارتباط با سرور';
        this.loading = false;
        console.error('Error deleting user:', error);
      }
    });
  }
  
  toggleUserStatus(user: User): void {
    const newStatus = !user.isActive;
    const action = newStatus ? 'فعال کردن' : 'غیرفعال کردن';
    
    if (!confirm(`آیا از ${action} این کاربر اطمینان دارید؟`)) {
      return;
    }
    
    this.loading = true;
    this.errorMessage = '';
    
    this.userService.toggleUserStatus(user.id, newStatus).subscribe({
      next: (response) => {
        if (response.success) {
          this.successMessage = `کاربر با موفقیت ${newStatus ? 'فعال' : 'غیرفعال'} شد`;
          this.loadUsers();
        } else {
          this.errorMessage = response.message || `خطا در ${action} کاربر`;
        }
        this.loading = false;
      },
      error: (error) => {
        this.errorMessage = 'خطا در ارتباط با سرور';
        this.loading = false;
        console.error('Error toggling user status:', error);
      }
    });
  }
  
  checkUserNameExists(): void {
    const userName = this.userForm.get('userName')?.value;
    if (userName && userName.length >= 3) {
      this.userService.checkUserNameExists(userName).subscribe({
        next: (response) => {
          if (response.success && response.data?.exists) {
            this.userForm.get('userName')?.setErrors({ userNameExists: true });
          }
        }
      });
    }
  }
  
  checkEmailExists(): void {
    const email = this.userForm.get('email')?.value;
    if (email && this.userForm.get('email')?.valid) {
      this.userService.checkEmailExists(email).subscribe({
        next: (response) => {
          if (response.success && response.data?.exists) {
            this.userForm.get('email')?.setErrors({ emailExists: true });
          }
        }
      });
    }
  }
  
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
  
  get paginatedUsers(): User[] {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    return this.users.slice(startIndex, startIndex + this.itemsPerPage);
  }
  
  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }
  
  changePage(page: number): void {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
    }
  }
  
  formatDate(dateString: string): string {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('fa-IR');
  }
  
  getStatusDisplay(isActive: boolean): string {
    return isActive ? 'فعال' : 'غیرفعال';
  }
  
  getStatusClass(isActive: boolean): string {
    return isActive ? 'badge-success' : 'badge-danger';
  }
}