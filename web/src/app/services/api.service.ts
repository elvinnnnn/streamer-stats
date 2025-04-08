import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private http = inject(HttpClient);

  getVideos(channelId: string): Observable<any> {
    return this.http.get(`http://localhost:3000/channel/videos/${channelId}`);
  }

  getChannelStats(channelId: string): Observable<any> {
    return this.http.get(
      `http://localhost:3000/channel-stats/latest/${channelId}`
    );
  }

  getChannelInfo(channelId: string): Observable<any> {
    return this.http.get(`http://localhost:3000/channel/info/${channelId}`);
  }

  getChannels(): Observable<any> {
    return this.http.get(`http://localhost:3000/channel/list`);
  }
}
