import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { ApiService } from '../services/api.service';
import { Video } from '../models/video.model';

export const channelUploadsResolver: ResolveFn<Video> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return inject(ApiService).getUploads(route.paramMap.get('id')!, '');
};
