import { Routes } from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {RegisterComponent} from './components/register/register.component';
import {HomeComponent} from './components/home/home.component';
import {HomeDetailsComponent} from './components/home-details/home-details.component';
import {HomeCreationFormComponent} from './components/home-creation-form/home-creation-form.component';

export const routes: Routes = [
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'register', component: RegisterComponent},
  {path: 'home', component: HomeComponent},
  {path: 'house/:id', component: HomeDetailsComponent},
  {path: 'registerHouse', component: HomeCreationFormComponent}
];
