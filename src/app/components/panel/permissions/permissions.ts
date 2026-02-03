import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgForOf, NgIf } from "@angular/common";
import { DashboardTopmenuComponent } from "../../Template/dashboard-topmenu/dashboard-topmenu.component";
import { DashboardSidebarComponent } from "../../Template/dashboard-sidebar/dashboard-sidebar.component";
import { PermissionsService } from '../../../services/permissions.service';
import { UserService } from '../../../services/user.service';
import { NgToastService } from "ng-angular-popup";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-permissions',
  standalone: true,
  templateUrl: './permissions.html',
  styleUrls: ['./permissions.scss'],
  imports: [ReactiveFormsModule, DashboardTopmenuComponent, DashboardSidebarComponent, NgForOf, NgIf]
})
export class Permissions implements OnInit {
  roles: any[] = [];
  allPermissions: any[] = [];
  users: any[] = [];
  groupedPermissions: { category: string, permissions: any[] }[] = [];

  showRoleModal = false;
  isEditMode = false;
  currentRoleId: number | null = null;
  roleForm: FormGroup;

  selectedPermissionIds: number[] = [];
  initialPermissionIds: number[] = [];

  constructor(
    private fb: FormBuilder,
    protected auth: AuthService,
    private permService: PermissionsService,
    private userService: UserService,
    private toast: NgToastService
  ) {
    this.roleForm = this.fb.group({
      roleName: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    if (!this.auth.hasPermission('role.permission.assign')) {
      console.warn('دسترسی محدود: ریکوئستی ارسال نشد.');
      return;
    }
    this.loadAllData();
  }

  loadAllData() {
    this.permService.GetAllRoles().subscribe(res => { if (res.success) this.roles = res.data; });
    this.permService.GetAllPermissions().subscribe(res => {
      if (res.success) {
        this.allPermissions = res.data;
        this.groupPermissionsByCategory(res.data);
      }
    });
    this.userService.getAllUsers().subscribe(res => {if(res.success) {this.users = res.data;}});
  }

  groupPermissionsByCategory(permissions: any[]) {
    const groups = permissions.reduce((acc, obj) => {
      const key = obj.category || 'عمومی';
      if (!acc[key]) acc[key] = [];
      acc[key].push(obj);
      return acc;
    }, {});
    this.groupedPermissions = Object.keys(groups).map(key => ({ category: key, permissions: groups[key] }));
  }

  openAddRoleModal() {
    this.isEditMode = false;
    this.currentRoleId = 0;
    this.roleForm.reset();
    this.selectedPermissionIds = [];
    this.initialPermissionIds = [];
    this.showRoleModal = true;
  }

  editRole(role: any) {
    this.isEditMode = true;
    this.currentRoleId = role.id;
    this.roleForm.patchValue({ roleName: role.name, description: role.description });

    this.permService.GetRolePermissions(role.id).subscribe(res => {
      if (res.success) {
        this.initialPermissionIds = res.data.map((p: any) => p.id);
        this.selectedPermissionIds = [...this.initialPermissionIds];
        this.showRoleModal = true;
      }
    });
  }

  saveRole() {
    if (this.roleForm.invalid) {
      this.toast.warning({ detail: "هشدار", summary: "لطفاً فرم را به درستی تکمیل کنید", duration: 3000 });
      return;
    }
    const payload = { name: this.roleForm.value.roleName, description: this.roleForm.value.description };

    if (this.isEditMode && this.currentRoleId) {
      this.permService.UpdateRole(this.currentRoleId, payload).subscribe(res => {
        if (res.success) this.syncPermissionsWithRole(this.currentRoleId!);
        else this.toast.error({ detail: "خطا", summary: res.message, duration: 5000 });
      });
    } else {
      this.permService.CreateRole(0, payload).subscribe(res => {
        if (res.success && res.data?.id) this.syncPermissionsWithRole(res.data.id);
        else this.toast.error({ detail: "خطا", summary: res.message, duration: 5000 });
      });
    }
  }

  syncPermissionsWithRole(roleId: number) {
    const newPermissions = this.selectedPermissionIds.filter(id => !this.initialPermissionIds.includes(id));

    if (newPermissions.length === 0) {
      this.finalizeSave();
      return;
    }

    let processed = 0;
    newPermissions.forEach(pId => {
      this.permService.AssignPermissionToRole({ roleId, permissionId: pId }).subscribe({
        next: () => { if (++processed === newPermissions.length) this.finalizeSave(); },
        error: (err) => { if (++processed === newPermissions.length) this.finalizeSave(); }
      });
    });
  }

  private finalizeSave() {
    this.showRoleModal = false;
    this.loadAllData();
    this.toast.success({ detail: "موفقیت", summary: "تغییرات نقش با موفقیت ذخیره شد", duration: 4000 });
  }

  deleteRole(id: number) {
    if (confirm('آیا از حذف این نقش اطمینان دارید؟')) {
      this.permService.DeleteRole(id).subscribe(res => {
        if (res.success) {
          this.loadAllData();
          this.toast.success({ detail: "حذف شد", summary: "نقش مورد نظر حذف گردید", duration: 3000 });
        } else {
          this.toast.error({ detail: "خطا", summary: res.message, duration: 5000 });
        }
      });
    }
  }

  assignRole(userId: number, roleId: string) {
    if (!roleId) {
      this.toast.info({ detail: "راهنما", summary: "لطفاً ابتدا یک نقش انتخاب کنید", duration: 3000 });
      return;
    }

    this.permService.AssignRoleToUser({ userId, roleId: Number(roleId) }).subscribe(res => {
      if (res.success) {
        this.loadAllData();
        this.toast.success({ detail: "تخصیص نقش", summary: "نقش با موفقیت به کاربر اختصاص یافت", duration: 4000 });
      } else {
        this.toast.error({ detail: "خطا", summary: res.message, duration: 5000 });
      }
    });
  }

  // متد حذف نقش با ساختار جدید سرویس شما
  removeRole(userId: number, roleId: number) {
    if (!roleId) return;

    if (confirm('آیا از حذف این نقش برای کاربر اطمینان دارید؟')) {
      this.permService.RemoveRoleFromUser(userId, roleId).subscribe({
        next: (res) => {
          if (res.success) {
            this.toast.success({ detail: "موفقیت", summary: "نقش با موفقیت از کاربر سلب شد", duration: 3000 });
            this.loadAllData(); // رفرش لیست برای دیدن تغییرات
          } else {
            this.toast.error({ detail: "خطا", summary: res.message, duration: 5000 });
          }
        },
        error: () => this.toast.error({ detail: "خطا", summary: "مشکل در برقراری ارتباط با سرور", duration: 5000 })
      });
    }
  }

  togglePermission(id: number) {
    const index = this.selectedPermissionIds.indexOf(id);
    if (index > -1) this.selectedPermissionIds.splice(index, 1);
    else this.selectedPermissionIds.push(id);
  }

  isPermSelected(id: number): boolean { return this.selectedPermissionIds.includes(id); }
  closeModal() { this.showRoleModal = false; }
}
