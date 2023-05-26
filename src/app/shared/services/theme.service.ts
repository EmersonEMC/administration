import { Injectable, OnDestroy } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BehaviorSubject, Observable, fromEvent } from 'rxjs';

export type ThemeOptions = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService implements OnDestroy {
  private readonly _storageTheme = 'adm_theme';
  private readonly _themeActive = new BehaviorSubject<ThemeOptions>('light');

  constructor() {
    this.onChangeTheme();
  }

  get theme(): Observable<ThemeOptions> {
    return this._themeActive.asObservable();
  }

  get themeApplied(): ThemeOptions {
    return this._themeActive.value;
  }

  onLoadTheme(): void {
    if (this.isDarkTheme()) {
      document.documentElement.removeAttribute('theme');
      this._themeActive.next('dark');
    } else {
      document.documentElement.setAttribute('theme', 'light');
      this._themeActive.next('light');
    }
  }

  private isDarkTheme(): boolean {
    const key = this._storageTheme;
    const itemLocalStorage = localStorage.getItem(key);
    return itemLocalStorage === 'dark' ? true : false;
  }

  setTheme(name: ThemeOptions): void {
    if (name === 'dark' && document.documentElement.hasAttribute('theme')) {
      document.documentElement.removeAttribute('theme');
    } else {
      document.documentElement.setAttribute('theme', 'light');
    }

    localStorage.setItem(this._storageTheme, name);
    this._themeActive.next(name);
  }

  private onChangeTheme(): void {
    fromEvent(document, 'changetheme')
      .pipe(takeUntilDestroyed())
      .subscribe((event) => {
        const changeThemeEvent = event as Event & {
          detail: { theme: ThemeOptions };
        };
        const { theme } = changeThemeEvent.detail;
        this._themeActive.next(theme);
      });
  }

  ngOnDestroy(): void {
    this._themeActive.next('light');
    this._themeActive.complete();
  }
}
