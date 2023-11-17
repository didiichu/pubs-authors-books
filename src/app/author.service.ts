// author.service.ts

import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthorService {
  private apiUrl = 'http://localhost:5285/api/pubs';

  constructor(private http: HttpClient) {}
  
  getAuthorDetails(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetAuthorById/${id}`);
  }

  updateAuthor(authorId: string, authorData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/UpdateAuthors/${authorId}`, authorData);
  }

  getTitlesWithAuthors(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/GetTitlesWithAuthors`);
  }

  getBooksByAuthorId(title_id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/GetBooksByTitleId/${title_id}`);
  }

}
