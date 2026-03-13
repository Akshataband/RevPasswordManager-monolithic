import { HttpInterceptorFn } from '@angular/common/http';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const auth = inject(AuthService);
  const router = inject(Router);

  const token = auth.getToken();

  let authReq = req;

  // Do NOT attach token to auth endpoints
  const isAuthRequest =
    req.url.includes('/auth/login') ||
    req.url.includes('/auth/register') ||
    req.url.includes('/auth/verify-2fa');

  if (token && !isAuthRequest) {
    authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(authReq).pipe(

    catchError((error) => {

      if (error.status === 401) {

        // Clear session
        auth.clearToken();
        auth.clearTempUsername();

        // Avoid redirect loop
        if (!router.url.includes('/login')) {
          router.navigate(['/login']);
        }

      }

      return throwError(() => error);

    })

  );
};