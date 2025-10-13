import { Routes } from '@angular/router';
import { HomeComponent } from './components/dashboard/home/home.component';
import { AuthComponent } from '../auth/auth.component';
import { IaComponent } from './components/ia/ia/ia.component';    
import { ProfileComponent } from './components/profile/profile.component';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, },
  { path: 'login', component: AuthComponent },
  { path :'ia', component: IaComponent},
  { path: 'profile', component: ProfileComponent},  
  { path: '**', redirectTo: 'login' },
 
 
];
