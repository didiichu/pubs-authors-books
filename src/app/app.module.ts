import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { AuthorDetailComponent } from './author-detail/author-detail.component';
import { RouterModule } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { AuthorComponent } from './author/author.component';
import { AuthorSearchComponent } from './author-search/author-search.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { BookSearchComponent } from './book-search/book-search.component';
import { BookComponent } from './book/book.component';
import { BookDetailComponent } from './book-detail/book-detail.component';


@NgModule({
    imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule,
    RouterModule.forRoot([]),
    AppRoutingModule
  ],

  declarations: [
    AppComponent,
    AuthorDetailComponent,
    AppComponent,
    AuthorComponent,
    AuthorSearchComponent,
    DashboardComponent,
    BookSearchComponent,
    BookComponent,
    BookDetailComponent,

  ],
  
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
