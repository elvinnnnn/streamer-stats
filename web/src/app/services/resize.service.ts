import {
  afterNextRender,
  afterRender,
  Injectable,
  signal,
} from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Injectable({
  providedIn: 'root',
})
export class ResizeService {
  drawer: MatSidenav | null = null;

  setDrawer(drawer: MatSidenav) {
    this.drawer = drawer;
  }

  constructor() {
    afterNextRender(() => {
      let timer: any = null;
      const handleResize = () => {
        if (!timer) {
          this.windowWidth.set(window.innerWidth);
          return;
        }
        clearTimeout(timer);
        timer = setTimeout(() => {
          this.windowWidth.set(window.innerWidth);
          timer = null;
        }, 500);
      };
      window.addEventListener('resize', handleResize);

      this.windowWidth.set(window.innerWidth);
      // Cleanup function to remove the event listener
      return () => {
        window.removeEventListener('resize', handleResize);
        if (timer) {
          clearTimeout(timer);
        }
      };
    });
  }

  windowWidth = signal(24.34);
}
