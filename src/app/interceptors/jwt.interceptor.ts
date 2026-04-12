import { HttpInterceptorFn } from '@angular/common/http';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  try {
    const token = typeof localStorage !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      const cloned = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
      return next(cloned);
    }
  } catch (_) {
    // SSR or restricted environment: ignore and proceed without auth header
  }
  return next(req);
};
