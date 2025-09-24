import { Component, OnInit, Input } from '@angular/core';
import { Note, NotesService } from '../../services/notes.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  imports: [CommonModule, FormsModule],
  selector: 'app-note-list',
  templateUrl: './note-list.component.html',
  styleUrls: ['./note-list.component.scss']
})
export class NoteListComponent implements OnInit {
  notes: Note[] = [];
  filteredNotes: Note[] = [];
  searchTerm = '';
  selectedTag = '';
  allTags: string[] = [];
  isLoading = false;

  // campos para edição
  selectedNote: Note | null = null;
  title = '';
  content = '';
  tags = '';
  isEditing = false;

  constructor(private notesService: NotesService) {}

  ngOnInit() {
    this.loadNotes();
  }

  loadNotes() {
    this.isLoading = true;
    this.notesService.getNotes().subscribe(data => {
      this.notes = data.map(note => ({
        ...note,
        tags: (note.tags as any).map((t: any) => t.tag.name) // pega só os nomes das tags
      }));
      this.filteredNotes = [...this.notes];
      this.extractAllTags();
      this.isLoading = false;
    });
  }

  extractAllTags() {
    const tagSet = new Set<string>();
    this.notes.forEach(note => {
      (note.tags as string[]).forEach(tag => tagSet.add(tag));
    });
    this.allTags = Array.from(tagSet);
  }

  filterNotes() {
    this.filteredNotes = this.notes.filter(note => {
      const matchesSearch = !this.searchTerm || 
        note.title.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        note.content.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      const matchesTag = !this.selectedTag || 
        (note.tags as string[]).includes(this.selectedTag);
      
      return matchesSearch && matchesTag;
    });
  }

  onSearchChange() {
    this.filterNotes();
  }

  onTagFilter() {
    this.filterNotes();
  }

  clearFilters() {
    this.searchTerm = '';
    this.selectedTag = '';
    this.filteredNotes = [...this.notes];
  }

  deleteNote(id: number, event: Event) {
    event.stopPropagation();
    if (confirm('Tem certeza que deseja excluir esta nota?')) {
      this.notesService.delete(id).subscribe(() => {
        this.loadNotes();
        if (this.selectedNote?.id === id) {
          this.clearForm();
        }
      });
    }
  }

  // Seleciona a nota e preenche os campos para editar
  editNote(note: Note, event: Event) {
    event.stopPropagation();
    this.selectedNote = note;
    this.title = note.title;
    this.content = note.content;
    this.tags = (note.tags as any).join(', ');
    this.isEditing = true;
  }

  // Atualizar nota selecionada
  updateNote() {
    if (!this.selectedNote) return;

    const updatedTags = this.tags.split(',').map(t => t.trim()).filter(t => t);

    this.notesService.update(this.selectedNote.id!, {
      title: this.title,
      content: this.content,
      tags: updatedTags,
      createdAt: ''
    }).subscribe(() => {
      this.loadNotes();
      this.clearForm();
    });
  }

  clearForm() {
    this.selectedNote = null;
    this.title = '';
    this.content = '';
    this.tags = '';
    this.isEditing = false;
  }

  getTagColor(tag: string): string {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd', '#98d8c8'];
    const index = tag.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    return colors[index % colors.length];
  }

  formatDate(date: string): string {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
}