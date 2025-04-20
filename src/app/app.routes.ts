import { Routes } from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {HomeComponent} from './components/home/home.component';
import {HomeDetailsComponent} from './components/home-details/home-details.component';
import {HomeCreationFormComponent} from './components/home-creation-form/home-creation-form.component';
import {HostessGuard} from './auth/hostess.guard';
import {UserProfileComponent} from './components/user-profile/user-profile.component';
import {AdminPanelComponent} from './components/admin-panel/admin-panel.component';
import {ForgotPasswordComponent} from './components/forgot-password/forgot-password.component';
import {ErrorComponent} from './components/error/error.component';
import {AdminGuard} from './auth/admin.guard';
import {UserConfigComponent} from './components/user-config/user-config.component';
import {HouseUpdateFormComponent} from './components/house-update-form/house-update-form.component';

export const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'home', component: HomeComponent},
  {path: 'house/:id', component: HomeDetailsComponent},
  {path: 'registerHouse', component: HomeCreationFormComponent, canActivate: [HostessGuard]},
  {path: 'updateHouse/:id', component: HouseUpdateFormComponent, canActivate: [HostessGuard]},
  {path: 'user/:id', component: UserProfileComponent},
  {path: 'admin/panel', component: AdminPanelComponent, canActivate: [AdminGuard]},
  {path: 'forgot-password', component: ForgotPasswordComponent},
  {path: 'configuration', component: UserConfigComponent},
  {path: 'error/:code', component: ErrorComponent},
  {path: '**', component: ErrorComponent} // Error 404 for unknown paths
];
