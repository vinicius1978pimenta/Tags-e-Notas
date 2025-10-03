import { Routes } from '@angular/router';
import { HomeComponent } from './components/dashboard/home/home.component';
import { AuthComponent } from '../auth/auth.component';
    

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, },
  { path: 'login', component: AuthComponent },
  { path: '**', redirectTo: 'login' },
];
