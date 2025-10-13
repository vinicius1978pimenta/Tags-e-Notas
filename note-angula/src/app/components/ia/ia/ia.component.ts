import { Component } from '@angular/core';
import { AiService, Message } from '../../../services/ai.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../navbar/navbar.component';

@Component({
  selector: 'app-ia',
  imports: [CommonModule, FormsModule,NavbarComponent],
  templateUrl: './ia.component.html',
  styleUrl: './ia.component.scss'
})
export class IaComponent {
  messages: Message[] = [];
  userInput: string = '';
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(private aiService: AiService) {
    this.addWelcomeMessage();
  }

  addWelcomeMessage() {
    this.messages.push({
      role: 'assistant',
      content: 'Olá! 👋 Sou sua assistente de IA. Como posso ajudar você hoje?',
      timestamp: new Date()
    });
  }

  sendMessage() {
    if (!this.userInput.trim() || this.isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: this.userInput,
      timestamp: new Date()
    };

    this.messages.push(userMessage);
    const inputValue = this.userInput;
    this.userInput = '';
    this.isLoading = true;
    this.errorMessage = '';

    this.aiService.sendMessage(this.messages).subscribe({
      next: (response) => {
        const assistantMessage: Message = {
          role: 'assistant',
          content: response.choices[0].message.content,
          timestamp: new Date()
        };
        this.messages.push(assistantMessage);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Erro ao enviar mensagem:', error);
        this.errorMessage = 'Erro ao processar sua mensagem. Verifique sua chave API.';
        this.isLoading = false;
        this.userInput = inputValue;
      }
    });
  }

  handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  clearChat() {
    this.messages = [];
    this.addWelcomeMessage();
    this.errorMessage = '';
  }

}
