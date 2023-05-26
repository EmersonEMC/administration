import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavbarComponent } from './navbar.component';
import { SwitchThemeComponent } from './switch-theme/switch-theme.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

@NgModule({
  declarations: [NavbarComponent, UserProfileComponent, SwitchThemeComponent],
  exports: [NavbarComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
})
export class NavbarModule {}
