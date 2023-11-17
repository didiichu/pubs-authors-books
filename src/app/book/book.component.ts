import { Component, OnInit, HostListener} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthorService } from '../author.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-book',
  templateUrl: './book.component.html',
  styleUrls: ['./book.component.css']
})
export class BookComponent implements OnInit {
  titlesWithAuthors: any[] = [];
  isSortingAscending = true;
  showBackToTop: boolean = false;
  title: any = {
    title_id: ''
  };

  constructor(private http: HttpClient, private router: Router, private authorService: AuthorService) {}

  ngOnInit(): void {
    this.loadTitlesWithAuthors();
  }

  loadTitlesWithAuthors(): void {
    this.authorService.getTitlesWithAuthors().subscribe(
      (data) => {
        this.titlesWithAuthors = data;
        console.log('Titles with Authors:', this.titlesWithAuthors);
      },
      (error) => {
        console.error('Error fetching titles with authors:', error);
      }
    );
  }

  sortAuthorsByAuId() {
    this.titlesWithAuthors.sort((a: { au_id: any }, b: { au_id: any }) => {
      const auIdA = a.au_id;
      const auIdB = b.au_id;

      if (this.isSortingAscending) {
        return auIdB.localeCompare(auIdA); // Sort from largest to smallest
      } else {
        return auIdA.localeCompare(auIdB); // Sort from smallest to largest
      }
    });

    // Toggle the sorting order
    this.isSortingAscending = !this.isSortingAscending;
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
  
  viewBookDetails(titleId: string) {
    this.router.navigate(['/book', titleId]);
  }

}
