import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { LoadingService } from '../services/loading.service';
import { delay, finalize } from 'rxjs';
import { HttpContextToken } from '@angular/common/http';

export const SKIP_LOADING_INTERCEPTOR = new HttpContextToken(() => false);

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.context.get(SKIP_LOADING_INTERCEPTOR)) {
    return next(req);
  }
  const busyService = inject(LoadingService);
  busyService.busy();
  return next(req).pipe(
    finalize(() => {
      busyService.idle();
    })
  );
};
