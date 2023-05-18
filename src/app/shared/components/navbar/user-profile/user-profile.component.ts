import { Component } from '@angular/core';
import { User } from 'src/app/shared/classes/user';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'adm-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent {
  user?: User | null;

  constructor(private _authService: AuthService) {
    this._authService.user.subscribe((user) => (this.user = user));
  }

  logout(): void {
    this._authService.logout();
  }
}
