import { DOCUMENT } from '@angular/common';
import { inject, Injectable, signal } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  document = inject(DOCUMENT);
  currentTheme = signal<Theme>('light');

  constructor() {
    this.setTheme(this.getThemeFromStorage());
  }

  toggleTheme() {
    if (this.currentTheme() === 'light') {
      this.setTheme('dark');
    } else {
      this.setTheme('light');
    }
  }

  setTheme(theme: Theme) {
    this.currentTheme.set(theme);
    if (theme === 'dark') {
      this.document.documentElement.classList.add('dark-theme');
    } else {
      this.document.documentElement.classList.remove('dark-theme');
    }
    this.setThemeInStorage(theme);
  }

  setThemeInStorage(theme: Theme) {
    localStorage.setItem('theme', theme);
  }

  getThemeFromStorage(): Theme {
    return (localStorage.getItem('theme') as Theme) ?? 'light';
  }
}
