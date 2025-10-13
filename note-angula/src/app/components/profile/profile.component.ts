import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { NavbarComponent } from '../navbar/navbar.component';


interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

@Component({
  selector: 'app-profile',
  imports: [NavbarComponent ],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {

  user: UserProfile = {
    id: '',
    name: '',
    email: '',
   
  };

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Aqui pegamos o token ou, melhor, os dados do usuário retornados no login
    const tokenUser = JSON.parse(localStorage.getItem('user') || '{}');
    if (tokenUser && tokenUser.name && tokenUser.email) {
      this.user = {
        ...tokenUser,
        avatarUrl: `https://ui-avatars.com/api/?name=${tokenUser.name.replace(' ', '+')}&background=ff6b35&color=fff`
      };
    }
  }

  logout() {
    this.authService.logout();
    window.location.href = '/login';
  }
}
