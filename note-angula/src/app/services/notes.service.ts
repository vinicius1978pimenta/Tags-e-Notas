import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Note {
createdAt: string;
  id?: number;
  title: string;
  content: string;
  tags: string[];
}

@Injectable({
  providedIn: 'root',
})
export class NotesService {
  private api = 'http://localhost:3000/notes';

  constructor(private http: HttpClient) {}

  getNotes(tag?: string): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.api}${tag ? '?tag=' + tag : ''}`);
  }

  create(note: Note): Observable<Note> {
    return this.http.post<Note>(this.api, note);
  }

  update(id: number, note: Note): Observable<Note> {
    return this.http.put<Note>(`${this.api}/${id}`, note);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.api}/${id}`);
  }
}
