import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthorService } from '../author.service';

interface TitleDetail {
  title_id: string;
  title: string;
  type: string;
  pub_id: string;
  price: number;
  advance: number;
  royalty: number;
  ytd_sales: number;
  notes: string;
  pubdate: string;
  authors: {
    au_id: string;
    au_fname: string;
    au_lname: string;
  }[];
}

@Component({
  selector: 'app-book-detail',
  templateUrl: './book-detail.component.html',
  styleUrls: ['./book-detail.component.css']
})
export class BookDetailComponent implements OnInit {
  titleDetails: TitleDetail[] = [];

  constructor(
    private route: ActivatedRoute,
    private authorService: AuthorService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const titleId = params['title_id'];
      this.loadTitleDetails(titleId);
    });
  }

  private loadTitleDetails(titleId: string) {
    if (!titleId) {
      return;
    }

    const apiUrl = `http://localhost:5285/api/pubs/GetBooksByTitleId/${titleId}`;

    this.http.get<any[]>(apiUrl).subscribe(
      (titles) => {
        // Group titles by title_id
        const groupedTitles = this.groupBy(titles, 'title_id') as Record<string, any[]>;

        // Extract title details along with associated authors
        this.titleDetails = Object.values(groupedTitles).map(group => ({
          title_id: group[0].title_id,
          title: group[0].title,
          type: group[0].type,
          pub_id: group[0].pub_id,
          price: group[0].price,
          advance: group[0].advance,
          royalty: group[0].royalty,
          ytd_sales: group[0].ytd_sales,
          notes: group[0].notes,
          pubdate: group[0].pubdate,
          authors: group.map(item => ({
            au_id: item.au_id,
            au_fname: item.au_fname,
            au_lname: item.au_lname
          }))
        }));

        console.log('Title details:', this.titleDetails);
      },
      (error) => {
        console.error('Error fetching title details:', error);
      }
    );
  }

  // Helper function to group an array of objects by a specified key
  private groupBy<T>(array: T[], key: keyof T): Record<string, T[]> {
    return array.reduce((result, currentValue) => {
      const currentKey = currentValue[key] as string;
      (result[currentKey] = result[currentKey] || []).push(currentValue);
      return result;
    }, {} as Record<string, T[]>);
  }
}
