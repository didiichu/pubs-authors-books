import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthorDetailComponent } from './author-detail/author-detail.component';
import { AuthorComponent } from './author/author.component';
import { AuthorSearchComponent } from './author-search/author-search.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BookSearchComponent } from './book-search/book-search.component';
import { BookComponent } from './book/book.component';
import { BookDetailComponent } from './book-detail/book-detail.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },  
  { path: 'author', component: AuthorComponent },
  { path: 'author/:id', component: AuthorDetailComponent },
  { path: 'author-search', component: AuthorSearchComponent},
  { path: 'book', component: BookComponent},
  { path: 'book/:title_id', component: BookDetailComponent },
  { path: 'book-search', component: BookSearchComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }