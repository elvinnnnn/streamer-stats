import {
  afterNextRender,
  AfterRenderPhase,
  Injectable,
  signal,
} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Injectable({
  providedIn: 'root',
})
export class ResizeService {
  drawer: MatSidenav | null = null;
  windowWidth = signal(24.34);

  setDrawer(drawer: MatSidenav) {
    this.drawer = drawer;
  }

  constructor() {
    afterNextRender(() => {
      let timer: any = null;
      window.addEventListener('resize', () => {
        if (!timer) {
          this.windowWidth.set(window.innerWidth);
          return;
        }
        clearTimeout(timer);
        timer = setTimeout(() => {
          this.windowWidth.set(window.innerWidth);
          timer = null;
        }, 500);
      });

      this.windowWidth.set(window.innerWidth);
    });
  }
}
