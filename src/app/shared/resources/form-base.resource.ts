import { Directive, Injector, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';

import { BaseResource } from './base.resource';

type Type<T> = { [K in keyof T]: AbstractControl<unknown, unknown> };

@Directive()
export abstract class FormBaseResource<T extends Type<T>>
  extends BaseResource
  implements OnInit
{
  private _formBuilder!: FormBuilder;
  public formGroup!: FormGroup<T>;

  protected abstract formValues(): T;
  public abstract submitForm(): void;

  constructor(protected override injector: Injector) {
    super(injector);
  }

  ngOnInit(): void {
    this.buildForm();
  }

  protected get formBuilder(): FormBuilder {
    if (!this._formBuilder) {
      this._formBuilder = this.injector.get(FormBuilder);
    }
    return this._formBuilder;
  }

  protected buildForm(): void {
    const group: T = this.formValues();
    this.formGroup = this.formBuilder.group<T>(
      group,
    ) as unknown as FormGroup<T>;
  }

  protected isValidForm(): boolean {
    if (this.formGroup?.invalid) {
      this.markFormAsTouched();
      return false;
    }
    return true;
  }

  protected markFormAsTouched(): void {
    Object.keys(this.formGroup?.controls).forEach((key) => {
      this.formGroup?.get(key)?.markAsTouched();
    });
  }
}
