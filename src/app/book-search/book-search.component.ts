import { Component, OnInit, HostListener } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book-search',
  templateUrl: './book-search.component.html',
  styleUrls: ['./book-search.component.css']
})
export class BookSearchComponent implements OnInit {
  readonly APIUrl = "http://localhost:5285/api/pubs/";
  
  booksWithAuthors: any = [];
  book: any = {
    title_id: ''
  };

  searchText: string = '';
  searchedBooks: any;
  selectedBook: any;
  showBackToTop: boolean = false;
  
  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.loadBooksWithAuthors();
  }

  loadBooksWithAuthors() {
    this.http.get<any[]>(this.APIUrl + 'GetTitlesWithAuthors').subscribe(
      (data) => {
        this.booksWithAuthors = data;
      },
      (error) => {
        console.error('Error fetching titles with authors:', error);
      }
    );
  }

  selectBook(book: any) {
    this.selectedBook = book;
    this.searchText = book.title;
  }

  searchBooks() {
    if (this.searchText) {
      const searchValue = this.searchText.toLowerCase();

      // Find the books whose titles match the entered text
      this.searchedBooks = this.booksWithAuthors.filter((book: any) => {
        const title = book.title.toLowerCase();
        return title.startsWith(searchValue);
      });
    } else {
      this.searchedBooks = [];
    }
  }

  goToBookDetail(bookId: string) {
    // Navigate to the book detail page using the bookId
    this.router.navigate(['/book-detail', bookId]);
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
