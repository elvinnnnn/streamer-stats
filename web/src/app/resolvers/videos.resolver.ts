import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  ResolveFn,
  RouterStateSnapshot,
} from '@angular/router';
import { ApiService } from '../services/api.service';
import { Video } from '../models/video';

export const videosResolver: ResolveFn<Video> = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  return inject(ApiService).getVideos(route.paramMap.get('id')!);
};
