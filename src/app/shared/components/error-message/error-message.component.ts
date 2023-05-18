import { Component, HostBinding, Input } from '@angular/core';
import { AbstractControl, ValidationErrors } from '@angular/forms';
import { getValidatorErrorMessage } from '../../utils/validator-utils';

@Component({
  selector: 'adm-error-message',
  templateUrl: './error-message.component.html',
  styleUrls: ['./error-message.component.scss'],
})
export class ErrorMessageComponent {
  @Input()
  control!: AbstractControl<unknown>;

  @HostBinding('class') errorClass = 'error-message';

  get errorMessage(): string | undefined | null {
    for (const validatorName in this.control?.errors) {
      if (this.control.touched)
        return getValidatorErrorMessage(
          validatorName,
          this.control.errors[validatorName] as ValidationErrors,
        );
    }
    return null;
  }
}
