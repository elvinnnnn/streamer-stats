import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);

  getUploads(channelId: string, continuation: string): Observable<any> {
    return this.http.get(
      `http://localhost:3000/video/uploads?channelId=${channelId}&continuation=${continuation}`
    );
  }

  getStreams(channelId: string, continuation: string): Observable<any> {
    return this.http.get(
      `http://localhost:3000/video/streams?channelId=${channelId}&continuation=${continuation}`
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
}
