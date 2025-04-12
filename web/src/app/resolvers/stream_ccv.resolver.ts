import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { ApiService } from '../services/api.service';
import { Video } from '../models/video.model';

export const streamCcvResolver: ResolveFn<Video> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return inject(ApiService).getStreamCcv(route.paramMap.get('id')!, '');
};
