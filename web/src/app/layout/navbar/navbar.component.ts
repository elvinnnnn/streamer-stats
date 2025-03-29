import { Component, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ResizeService } from '../../services/resize.service';
import { Theme, ThemeService } from '../../services/theme.service';
import { MatButtonModule } from '@angular/material/button';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [MatToolbarModule, MatIconModule, MatButtonModule],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  resizeService = inject(ResizeService);
  themeService = inject(ThemeService);

  ngOnInit() {
    const savedMode: Theme =
      (localStorage.getItem('theme') as Theme) ||
      (window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light');
    this.themeService.setTheme(savedMode);
  }
}
