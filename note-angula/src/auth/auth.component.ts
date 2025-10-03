import { Component } from '@angular/core';
import { AuthService } from '../app/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ✅ import FormsModule

@Component({
  imports: [CommonModule, FormsModule],  // ✅ adiciona FormsModule aqui
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
  standalone: true                      // ✅ componente standalone
})
export class AuthComponent {
  email = '';
  password = '';
  message = '';

  constructor(private authService: AuthService,
              private router: Router) {}

  cadastrar() {
    this.authService.create(this.email, this.password).subscribe({
      next: () => this.message = 'Usuário cadastrado com sucesso!',
      error: () => this.message = 'Erro ao cadastrar'
    });
  }

  logar() {
    this.authService.login(this.email, this.password).subscribe({
      next: (res) => {
        this.authService.setTokens(res);
        this.router.navigate(['home']);
      },
      error: () => this.message = 'Credenciais inválidas'
    });
  }
}
