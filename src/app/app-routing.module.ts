import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [ {
  path: '',
  loadChildren: () => import('./main/main.module').then((m) => m.MainModule),
},
{
  path: 'login',
  loadChildren: () =>
    import('./pages/login/login.module').then((m) => m.LoginModule),
},
{
  path: '404',
  loadChildren: () =>
    import('./pages/not-found/not-found.module').then(
      (m) => m.NotFoundModule,
    ),
},
{ path: '**', redirectTo: '404' },];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
