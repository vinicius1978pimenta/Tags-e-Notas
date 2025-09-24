import { Component, OnInit } from '@angular/core';
import { NoteFormComponent } from '../../note-form/note-form.component';
import { NoteListComponent } from '../../note-list/note-list.component';
import { Note, NotesService } from '../../../services/notes.service';

@Component({
  selector: 'app-home',
  imports: [NoteFormComponent, NoteListComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'] // corrigido
})
export class HomeComponent implements OnInit {
  totalNotes = 0;
  totalTags = 0;

  constructor(private readonly notesService: NotesService) {}

  ngOnInit() {
    this.loadStats();
  }

  // Carrega estatísticas de notas e tags
  loadStats() {
    this.notesService.getNotes().subscribe((notes: Note[]) => {
      this.updateCounts(notes);
    });
  }

  // Atualiza contagem de notas e tags
  updateCounts(notes: Note[]) {
    this.totalNotes = notes.length;

    const tagSet = new Set<string>();
    notes.forEach(note => {
      (note.tags as string[]).forEach(tag => tagSet.add(tag));
    });
    this.totalTags = tagSet.size;
  }

  // Método chamado quando uma nova nota é criada
  onNoteCreated() {
    this.loadStats(); // recarrega notas e atualiza contagem
  }
}
