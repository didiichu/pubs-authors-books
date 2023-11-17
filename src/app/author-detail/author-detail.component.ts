import { Component, OnInit, HostListener } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthorService } from '../author.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-author-detail',
  templateUrl: './author-detail.component.html',
  styleUrls: ['./author-detail.component.css']
})
export class AuthorDetailComponent implements OnInit {
  authorId: string = '';
  author: any;
  isEditing: boolean = false;
  updatedAuthor: any = {};
  errorMessage: { [key: string]: string } = {};
  formatErrors: { [key: string]: string } = {};
  showDeleteForm = false;
  showBackToTop: boolean = false;

  readonly APIUrl = "http://localhost:5285/api/pubs/"
  constructor(private route: ActivatedRoute, private authorService: AuthorService, private http: HttpClient, private router: Router) {}
  
  @HostListener('window:scroll', [])
  onWindowScroll() {
    if (window.pageYOffset > 50) { // You can adjust this value as needed
      this.showBackToTop = true;
    } else {
      this.showBackToTop = false;
    }
  }

  // Add this function to your component
  scrollToTop() {
    window.scroll({ top: 0, left: 0, behavior: 'smooth' });
  }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.authorId = params['id']; 
      this.loadAuthorDetail(this.authorId);
    });
  }

  goBack(): void {
    this.router.navigate(['/author'])
  }

  private loadAuthorDetail(authorId: string) {
    if (!authorId) {
      return; 
    }

    const apiUrl = `http://localhost:5285/api/pubs/GetAuthorById/${this.authorId}`;

    this.http.get<any>(apiUrl).subscribe(
      (author) => {
        this.author = author;
        this.updatedAuthor = { ...author[0] }; 
        this.updatedAuthor.contract = this.author[0].contract === 'true';
        console.log('Author details:', this.author);
      },
      (error) => {
        console.error('Error fetching author details:', error);
      }
    );
  }

  enableEditing(): void {
    this.isEditing = !this.isEditing;
    this.updatedAuthor = { ...this.author[0] };
  }

  saveChanges(): void {
    const updatedAuthorData = {
      au_fname: this.updatedAuthor.au_fname,
      au_lname: this.updatedAuthor.au_lname,
      phone: this.updatedAuthor.phone,
      address: this.updatedAuthor.address,
      city: this.updatedAuthor.city,
      state: this.updatedAuthor.state,
      zip: this.updatedAuthor.zip,
      contract: this.updatedAuthor.contract,
    };
  
    console.log('Updated Author Data:', updatedAuthorData);

    this.errorMessage = {};
    this.formatErrors = {};

    if (!updatedAuthorData.au_fname) {
      this.errorMessage['au_fname'] = "Please enter the author's first name.";
    } else {
      const namePattern = /^[A-Za-z]+$/; // Accept only letters
      if (!namePattern.test(updatedAuthorData.au_fname)) {
        this.formatErrors['au_fname'] = "Please enter a valid first name with letters only.";
      }
    }
  
    if (!updatedAuthorData.au_lname) {
      this.errorMessage['au_lname'] = "Please enter the author's last name.";
    } else {
      const namePattern = /^[A-Za-z]+$/; // Accept only letters
      if (!namePattern.test(updatedAuthorData.au_lname)) {
        this.formatErrors['au_lname'] = "Please enter a valid last name with letters only.";
      }
    }

    if (!updatedAuthorData.phone) {
      this.errorMessage['phone'] = "Please enter the author's phone number.";
    } else {
      const phonePattern = /^\d{3}-\d{3}-\d{4}$/;
      if (this.updatedAuthor.phone && !phonePattern.test(this.updatedAuthor.phone)) {
        this.formatErrors['phone'] =
          "Please enter a valid phone number (format: ***-***-****).";
      }
    }
    if (!updatedAuthorData.address) {
      this.errorMessage['address'] = "Please enter the author's address.";
    } else {
      const addressPattern = /^[A-Za-z0-9\s.,]+$/; 
      if (!addressPattern.test(updatedAuthorData.address)) {
        this.formatErrors['address'] = "Please enter a valid address with alphanumeric characters and spaces.";
      }
    }

    if (!updatedAuthorData.city) {
      this.errorMessage['city'] = "Please enter the author's city.";
    } else {
      const cityPattern = /^[A-Za-z]+$/; // Accept only letters
      if (!cityPattern.test(updatedAuthorData.city)) {
        this.formatErrors['city'] = "Please enter a valid City with letters only.";
      }
    }

    if (!updatedAuthorData.state) {
      this.errorMessage['state'] = "Please enter the author's state.";
    } else {
      const statePattern = /^[A-Z]{2}$/; 
      if (!statePattern.test(updatedAuthorData.state)) {
        this.formatErrors['state'] = "Please enter a valid state code consisting of two capital letters (e.g., NY).";
      }
    }

    if (!updatedAuthorData.zip) {
      this.errorMessage['zip'] = "Please enter the author's zip.";
    } else {
      const zipPattern = /^\d{5}$/; 
      if (!zipPattern.test(updatedAuthorData.zip)) {
        this.formatErrors['zip'] = "Please enter a valid ZIP code consisting of five numeric digits.";
      }
    }

    /*if (!updatedAuthorData.contract) {
      this.errorMessage['contract'] = "Please enter the author's contract information.";
    } else {
      const contractPattern = /^(true|false)$/i; 
      if (!contractPattern.test(updatedAuthorData.contract)) {
        this.formatErrors['contract'] = "Please enter either 'true' or 'false' for the contract.";
      }
    }*/
    if (Object.keys(this.errorMessage).length === 0 && Object.keys(this.formatErrors).length === 0) {
      if (this.authorId) {
        this.updatedAuthor.contract = this.updatedAuthor.contract ? 'true' : 'false';
        this.authorService.updateAuthor(this.authorId, updatedAuthorData).subscribe(
          (data) => {
            //show a success message
            this.isEditing = false;

            this.loadAuthorDetail(this.authorId);
          },
          (error) => {
            console.error('Error updating author:', error);
            // show an error message
          }
        );
      } else {
        console.error('Author ID is not defined.');
      }
    }
  }

  deleteAuthor() {
    // Extract au_id from the URL
    const au_id = this.route.snapshot.paramMap.get('id');
    if (confirm('Are you sure you want to delete this author?')) {
      const url = `${this.APIUrl}DeleteAuthors?au_id=${au_id}`;
      this.http.delete(url).subscribe(
        response => {
          console.log('Author deleted successfully:', response);
          this.router.navigate(['/author']); // Navigates back to the list of authors
        },
        error => {
          console.error('Error deleting author:', error);
          alert('Error deleting author. Please check the console for details.');
        }
      );
    }
  }
}
