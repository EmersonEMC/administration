import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

@NgModule({
  declarations: [NavbarComponent, UserProfileComponent],
  exports: [NavbarComponent],
  imports: [CommonModule],
})
export class NavbarModule {}
