import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { NgToastService } from 'ng-angular-popup';

// Functional Guard برای صفحاتی که نیاز به لاگین دارند
export const authGuard: CanActivateFn = (): boolean => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const toast = inject(NgToastService);
  
  if (auth.isLoggedIn()) {
    return true;
  } else {
    toast.error({ detail: "ERROR", summary: "لطفاً ابتدا وارد شوید!", duration: 3000 });
    router.navigate(['login']);
    return false;
  }
};

// Functional Guard برای صفحه لاگین (اگر کاربر لاگین کرده، نرود به لاگین)
export const loginGuard: CanActivateFn = (): boolean => {
  const auth = inject(AuthService);
  const router = inject(Router);
  const toast = inject(NgToastService);
  
  if (auth.isLoggedIn()) {
    toast.info({ detail: "Redirect", summary: "شما قبلاً وارد شده‌اید!", duration: 3000 });
    router.navigate(['brokerages']);
    return false;
  }
  return true;
};