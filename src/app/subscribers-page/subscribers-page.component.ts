import { NgIf, NgFor, NgClass, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { DividerComponent } from '../divider/divider.component';
import { FooterComponent } from '../footer/footer.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { ContentComponent } from '../stories/content/content.component';
import { TitleComponent } from '../title/title.component';

@Component({
  selector: 'app-subscribers-page',
  standalone: true,
  imports: [
    HttpClientModule,
    NgIf,
    NgFor,
    NgClass,
    InfiniteScrollModule,
    RouterModule,
    NavbarComponent,
    TitleComponent,
    DividerComponent,
    FooterComponent,
    DatePipe,
    ContentComponent,
  ],
  templateUrl: './subscribers-page.component.html',
  styleUrl: './subscribers-page.component.scss'
})
export class SubscribersPageComponent {

}
