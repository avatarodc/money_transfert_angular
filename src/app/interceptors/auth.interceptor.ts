// interceptors/auth.interceptor.ts
import { HttpInterceptorFn } from '@angular/common/http';

export const AuthInterceptor: HttpInterceptorFn = (req, next) => {
  const token = localStorage.getItem('token');
  console.log('Token dans l\'intercepteur:', token);

  if (token) {
    const clonedRequest = req.clone({
      setHeaders: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    // Débogage des headers
    console.log('Headers envoyés:', clonedRequest.headers.get('Authorization'));
    return next(clonedRequest);
  }

  return next(req);
};
