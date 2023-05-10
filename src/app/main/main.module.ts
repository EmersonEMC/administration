import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MainRoutingModule } from './main-routing.module';
import { MainComponent } from './main.component';
import { SidebarModule } from '../shared/components/sidebar/sidebar.module';
import { NavbarModule } from '../shared/components/navbar/navbar.module';

@NgModule({
  declarations: [MainComponent],
  imports: [CommonModule, MainRoutingModule, SidebarModule, NavbarModule],
})
export class MainModule {}
