import { HttpClient, HttpContext } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SKIP_LOADING_INTERCEPTOR } from '../interceptors/loading.interceptor';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);

  getUploads(
    channelId: string,
    continuation: string,
    skipInterceptor = false
  ): Observable<any> {
    const options = skipInterceptor
      ? { context: new HttpContext().set(SKIP_LOADING_INTERCEPTOR, true) }
      : {};
    return this.http.get(
      `http://localhost:3000/video/uploads?channelId=${channelId}&continuation=${continuation}`,
      options
    );
  }

  getStreams(
    channelId: string,
    continuation: string,
    skipInterceptor = false
  ): Observable<any> {
    const options = skipInterceptor
      ? { context: new HttpContext().set(SKIP_LOADING_INTERCEPTOR, true) }
      : {};
    return this.http.get(
      `http://localhost:3000/video/streams?channelId=${channelId}&continuation=${continuation}`,
      options
    );
  }

  getChannelStats(channelId: string): Observable<any> {
    return this.http.get(`http://localhost:3000/channel-stats/${channelId}`);
  }

  getChannelInfo(channelId: string): Observable<any> {
    return this.http.get(`http://localhost:3000/channel/info/${channelId}`);
  }

  getChannels(): Observable<any> {
    return this.http.get(`http://localhost:3000/channel/list`);
  }

  getStreamCcv(streamId: string, continuation: string): Observable<any> {
    return this.http.get(
      `http://localhost:3000/stream-stats/ccv?streamId=${streamId}&continuation=${continuation}`
    );
  }

  getStreamStats(streamId: string, continuation: string): Observable<any> {
    return this.http.get(
      `http://localhost:3000/stream-stats/data?streamId=${streamId}&continuation=${continuation}`
    );
  }

  getStreamsFromDb(): Observable<any> {
    return this.http.get(`http://localhost:3000/video/live-upcoming`);
  }
}
