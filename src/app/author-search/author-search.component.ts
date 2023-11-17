import { Component, OnInit, HostListener} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthorService } from '../author.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-author-search',
  templateUrl: './author-search.component.html',
  styleUrls: ['./author-search.component.css']
})
export class AuthorSearchComponent {
  readonly APIUrl = "http://localhost:5285/api/pubs/"
  constructor(private http: HttpClient, private router: Router, private AuthorService: AuthorService) {
  }

  authors: any = [];
  author: any = {
    au_id: ''
  };

  searchText: string = '';
  searchName: string = '';
  searchedAuthors: any;
  selectedAuthor: any;
  showBackToTop: boolean = false;

  ngOnInit() {
    this.refreshAuthors();
  }
  refreshAuthors() {
    this.http.get<any[]>(this.APIUrl + 'GetAuthors').subscribe((data: any[]) => {
      this.authors = data;
    });
  }

  selectAuthor(author: any) {
    this.selectedAuthor = author;
    this.searchName = `${author.au_fname} ${author.au_lname}`;
  }

  searchAuthor() {
    if (this.searchName) {
      const searchValue = this.searchName.toLowerCase();

      // Find the authors whose names match the entered text
      this.searchedAuthors = this.authors.filter((author: any) => {
        const fullName = `${author.au_fname} ${author.au_lname}`.toLowerCase();
        return fullName.startsWith(this.searchName.toLowerCase());
      });
    } else {
      this.searchedAuthors = [];
    }
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (window.pageYOffset > 50) { // You can adjust the scroll value as needed
      this.showBackToTop = true;
    } else {
      this.showBackToTop = false;
    }
  }


  scrollToTop() {
    window.scroll({ top: 0, left: 0, behavior: 'smooth' });
  }

}


