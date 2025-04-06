import { NgxSpinnerConfig } from './../../node_modules/ngx-spinner/lib/config.d';
import {
  AfterViewInit,
  Component,
  ViewChild,
  effect,
  inject,
  untracked,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { MatSidenavModule, MatSidenav } from '@angular/material/sidenav';
import { ResizeService } from './services/resize.service';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { SidenavComponent } from './layout/sidenav/sidenav.component';
import { NgxSpinnerModule } from 'ngx-spinner';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [
    NgxSpinnerModule,
    NavbarComponent,
    SidenavComponent,
    RouterModule,
    MatSidenavModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements AfterViewInit {
  @ViewChild(MatSidenav) drawer!: MatSidenav;
  resizeService = inject(ResizeService);

  ngAfterViewInit() {
    if (this.drawer) this.resizeService.setDrawer(this.drawer);
  }

  drawerEffect = effect(() => {
    const width = this.resizeService.windowWidth();
    const drawer = untracked(() => this.drawer);
    if (!drawer) return;
    if (width > 1200) {
      drawer.mode = 'side';
      drawer.fixedTopGap = 65;
      if (!drawer.opened) {
        drawer.open();
      }
    } else {
      drawer.mode = 'over';
      drawer.fixedTopGap = 0;
      if (drawer.opened) {
        drawer.close();
      }
    }
  });
}
