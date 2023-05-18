import { Component, Injector } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { first } from 'rxjs';
import { AuthService } from 'src/app/shared/services/auth.service';
import { FormBaseResource } from '../../shared/resources/form-base.resource';
import { ActivatedRoute } from '@angular/router';

interface LoginForm {
  email: FormControl<string | null>;
  password: FormControl<string | null>;
}

@Component({
  selector: 'adm-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends FormBaseResource<LoginForm> {
  submitted = false;
  error?: string;

  constructor(
    protected override injector: Injector,
    private _authService: AuthService,
  ) {
    super(injector);
    if (this._authService.userValue) {
      void this.router.navigate(['/dashboard']);
    }
  }

  protected override formValues(): LoginForm {
    return {
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    };
  }

  get email(): string | null {
    return this.formGroup.controls.email.value;
  }

  get password(): string | null {
    return this.formGroup.controls.password.value;
  }

  public override submitForm(): void {
    this.submitted = true;
    this.error = '';
    this.isValidForm();

    if (!this.email || !this.password) {
      return;
    }

    this._authService
      .login(this.email, this.password)
      .pipe(first())
      .subscribe({
        next: () => {
          this.navigateTo();
        },
        error: (error: Error) => {
          this.error = error.message;
        },
      });
  }

  private navigateTo(): void {
    const returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] as
      | string
      | undefined;
    const url: string = returnUrl || '/dashboard';
    void this.router.navigateByUrl(url);
  }
}
