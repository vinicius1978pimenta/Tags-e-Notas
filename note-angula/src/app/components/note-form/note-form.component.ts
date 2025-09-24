import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { NotesService, Note } from '../../services/notes.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  imports: [FormsModule, CommonModule],
  selector: 'app-note-form',
  templateUrl: './note-form.component.html',
  styleUrls: ['./note-form.component.scss']
})
export class NoteFormComponent implements OnInit {
  title = '';
  content = '';
  tags = '';
  isSubmitting = false;
  showForm = false;

  @Output() noteCreated = new EventEmitter<void>();

  // Sugestões de tags baseadas nas notas existentes
  suggestedTags: string[] = [];
  allExistingTags: string[] = [];

  constructor(private notesService: NotesService) {}

  ngOnInit() {
    this.loadExistingTags();
  }

  loadExistingTags() {
    this.notesService.getNotes().subscribe(data => {
      const tagSet = new Set<string>();
      data.forEach(note => {
        (note.tags as any).forEach((t: any) => {
          tagSet.add(t.tag.name);
        });
      });
      this.allExistingTags = Array.from(tagSet);
    });
  }

  // Criar nova nota
  async createNote() {
    if (!this.title.trim() || !this.content.trim()) {
      return;
    }

    this.isSubmitting = true;
    
    const newNote: Note = {
      title: this.title.trim(),
      content: this.content.trim(),
      tags: this.tags.split(',').map(t => t.trim()).filter(t => t),
      createdAt: ''
    };

    try {
      await this.notesService.create(newNote).toPromise();
      this.noteCreated.emit();
      this.clearForm();
      this.showSuccessMessage();
    } catch (error) {
      console.error('Erro ao criar nota:', error);
    } finally {
      this.isSubmitting = false;
    }
  }

  showSuccessMessage() {
    // Implementar notificação de sucesso se necessário
    console.log('Nota criada com sucesso!');
  }

  clearForm() {
    this.title = '';
    this.content = '';
    this.tags = '';
    this.showForm = false;
  }

  toggleForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.clearForm();
    }
  }

  // Sugerir tags enquanto o usuário digita
  onTagInput() {
    const currentTags = this.tags.split(',').map(t => t.trim());
    const lastTag = currentTags[currentTags.length - 1].toLowerCase();
    
    if (lastTag.length > 0) {
      this.suggestedTags = this.allExistingTags.filter(tag => 
        tag.toLowerCase().includes(lastTag) && 
        !currentTags.slice(0, -1).includes(tag)
      ).slice(0, 5);
    } else {
      this.suggestedTags = [];
    }
  }

  selectSuggestedTag(tag: string) {
    const currentTags = this.tags.split(',').map(t => t.trim());
    currentTags[currentTags.length - 1] = tag;
    this.tags = currentTags.join(', ');
    this.suggestedTags = [];
  }

  getTagColor(tag: string): string {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8'];
    const index = tag.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return colors[index % colors.length];
  }

  isFormValid(): boolean {
    return this.title.trim().length > 0 && this.content.trim().length > 0;
  }
}