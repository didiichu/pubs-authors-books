import { Component, OnInit, HostListener} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthorService } from '../author.service';
import { Router } from '@angular/router';


@Component({
  selector: 'app-author',
  templateUrl: './author.component.html',
  styleUrls: ['./author.component.css']
})
export class AuthorComponent implements OnInit{

  title = 'Authors Management';
  readonly APIUrl = "http://localhost:5285/api/pubs/"
  data: any;
  isSortingAscending = true;
  isFnameSortingAscending = true;
  constructor(private http: HttpClient, private router: Router, private AuthorService: AuthorService) {
  }

  authors: any = [];
  author: any = {
    au_id: ''
  };

  newAuthor: any = {
    au_id: '',
    au_lname: '',
    au_fname: ''
  };
  searchText: string = '';
  filteredAuthors: any = [];
  showModal = false;
  showBackToTop: boolean = false;


  searchName: string = '';
  searchedAuthors: any;
  showAutocomplete: boolean = false;

  errorMessage: { [key: string]: string } = {};
  formatErrors: { [key: string]: string } = {};
  selectedAuthor: any;

  sortAuthorsByAuId() {
    this.authors.sort((a: { au_id: any; }, b: { au_id: any; }) => {
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
// Function to sort based on "au_fname"
  sortAuthorsByAuFname() {
  this.authors.sort((a: { au_fname: any; }, b: { au_fname: any; }) => {
    const auFnameA = a.au_fname;
    const auFnameB = b.au_fname;

    if (this.isFnameSortingAscending) {
      return auFnameA.localeCompare(auFnameB); // Sort in ascending order
    } else {
      return auFnameB.localeCompare(auFnameA); // Sort in descending order
    }
  });

  // Toggle the sorting order for "au_fname"
  this.isFnameSortingAscending = !this.isFnameSortingAscending;
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

  hasErrors(): boolean {
    return (
      Object.keys(this.errorMessage).length > 0 || Object.keys(this.formatErrors).length > 0
    );
  }

  openModal() {
    this.showModal = !this.showModal;
  }

  closeModal() {
    this.showModal = false;
    this.resetNewAuthor();
  }

  ngOnInit() {
    this.refreshAuthors();
  }

  addAuthor() {
    const { au_id, au_lname, au_fname } = this.newAuthor;

    this.errorMessage = {};
    this.formatErrors = {};

    if (!this.newAuthor.au_id) {
      this.errorMessage['au_id'] = "Please enter the author's id number.";
    } else {
      const idPattern = /^\d{3}-\d{2}-\d{4}$/;
      if (this.newAuthor.au_id && !idPattern.test(this.newAuthor.au_id)) {
        this.formatErrors['au_id'] =
          "Please enter a valid id number (format: 111-11-1111).";
      }
    }

    if (!this.newAuthor.au_fname) {
      this.errorMessage['au_fname'] = "Please enter the author's first name.";
    } else {
      const namePattern = /^[A-Za-z]+$/; // Accept only letters
      if (!namePattern.test(this.newAuthor.au_fname)) {
        this.formatErrors['au_fname'] = "Please enter a valid first name with letters only.";
      }
    }

    if (!this.newAuthor.au_lname) {
      this.errorMessage['au_lname'] = "Please enter the author's last name.";
    } else {
      const namePattern = /^[A-Za-z]+$/; // Accept only letters
      if (!namePattern.test(this.newAuthor.au_lname)) {
        this.formatErrors['au_lname'] = "Please enter a valid last name with letters only.";
      }
    }
    // Check if all fields are provided
    if (Object.keys(this.errorMessage).length === 0 && Object.keys(this.formatErrors).length === 0) {
      if (au_id && au_lname && au_fname) {
        const url = `${this.APIUrl}AddAuthors?au_id=${au_id}&au_lname=${au_lname}&au_fname=${au_fname}`;

        this.http
          .post<any>(url, {})
          .subscribe(
            (response) => {
              console.log('Add author response:', response);
              this.refreshAuthors();
              this.closeModal();
            },
            (error) => {
              console.error('Error adding author:', error);
              alert('Error adding author. Please check the console for details.');
            }
          );
      } else {
        alert('Please provide all the author details.');
      }
    }
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

  resetNewAuthor() {
    this.newAuthor = { au_id: '', au_lname: '', au_fname: '' };
  }

  viewAuthorDetails(authorId: string) {
    this.router.navigate(['/author', authorId]);
  }

  
}
