import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ThemeService } from 'src/app/shared/services/theme.service';

interface IThemeForm {
  mode: FormControl<boolean>;
}

@Component({
  selector: 'adm-switch-theme',
  templateUrl: './switch-theme.component.html',
  styleUrls: ['./switch-theme.component.scss'],
})
export class SwitchThemeComponent implements OnInit, OnDestroy {
  form!: FormGroup<IThemeForm>;
  private _sub!: Subscription;
  private _themes: { [key: string]: () => void } = {
    ['light']: this.toggleLightTheme.bind(this),
    ['dark']: this.toggleDarkTheme.bind(this),
  };

  constructor(private readonly _themeService: ThemeService) {}

  ngOnInit(): void {
    this.form = new FormGroup<IThemeForm>({
      mode: new FormControl(false, { nonNullable: true }),
    });

    this._sub = this._themeService.theme.subscribe((theme) => {
      this._themes[theme]();
    });
  }

  onToggleTheme(event: EventTarget | null): void {
    if (event) {
      const target = <HTMLInputElement>event;
      this.setTheme(target.checked);
    }
  }

  private toggleLightTheme(): void {
    this.form.controls.mode.patchValue(true);
  }

  private toggleDarkTheme(): void {
    this.form.controls.mode.patchValue(false);
  }

  private setTheme(theme: boolean): void {
    if (theme) {
      this._themeService.setTheme('light');
      return;
    }

    this._themeService.setTheme('dark');
  }

  ngOnDestroy(): void {
    if (this._sub) {
      this._sub.unsubscribe();
    }
  }
}
