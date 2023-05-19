import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ContentLayoutComponent } from './shared/layout/content-layout/content-layout.component';
import { AuthGuard } from './core/guard/auth.guard';
import { LoginComponent } from './modules/auth/login/login.component';
import { NoRoleComponent } from './modules/no-role/no-role.component';
import { ForgotPasswordComponent } from './modules/auth/login/forgot-password/forgot-password.component';
import { CreateNewPasswordComponent } from './modules/auth/login/create-new-password/create-new-password.component';



const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },

  {
    path: '',
    component: ContentLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./modules/system/system.module').then(
            (m) => m.SystemModule
          ),
      },
      {
        path: 'leader',
        loadChildren: () =>
          import('./modules/leader/leader.module').then((m) => m.LeaderModule),
      }


    ],
    canActivate: [AuthGuard],
  },
  { path: 'login', component: LoginComponent },
  { path: 'forgot', component: ForgotPasswordComponent },
  { path: 'reset/password/:token', component: CreateNewPasswordComponent },

  { path: '**', component: NoRoleComponent },
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
