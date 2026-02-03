import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Directive({
  selector: '[appHasPermission]',
  standalone: true
})
export class HasPermissionDirective {

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService
  ) {}

  @Input() set appHasPermission(permission: string) {
    if (this.authService.hasPermission(permission)) {
      // اگر دسترسی داشت، المان را بساز
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      // اگر نداشت، المان را کاملاً از DOM حذف کن
      this.viewContainer.clear();
    }
  }
}
