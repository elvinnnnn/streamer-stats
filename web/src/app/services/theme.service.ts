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
    const savedTheme = (localStorage.getItem('theme') as Theme) || 'light';
    this.currentTheme.set(savedTheme);
  }

  toggleTheme() {
    const element = document.querySelector('html');
    const isDarkMode = element!.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    this.currentTheme.set(isDarkMode ? 'dark' : 'light');
  }
}
