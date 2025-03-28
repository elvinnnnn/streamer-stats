import {
  Component,
  AfterViewInit,
  ViewChild,
  effect,
  inject,
} from '@angular/core';
// import { RouterOutlet } from '@angular/router';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { ResizeService } from './services/resize.service';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { Theme, ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  imports: [MatSidenavModule, MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'web';
  resizeService = inject(ResizeService);
  themeService = inject(ThemeService);

  // side nav logic
  @ViewChild(MatSidenav) drawer!: MatSidenav;
  ngAfterViewInit() {
    this.resizeService.setDrawer(this.drawer);
  }

  drawerEffect = effect(() => {
    const width = this.resizeService.windowWidth();
    if (width > 1200) {
      this.drawer.mode = 'side';
      this.drawer.fixedTopGap = 65;
      if (!this.drawer.opened) {
        this.drawer.open();
      }
    } else {
      this.drawer.mode = 'over';
      this.drawer.fixedTopGap = 0;
      if (this.drawer.opened) {
        this.drawer.close();
      }
    }
  });
}
