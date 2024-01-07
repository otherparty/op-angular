import { NgClass, NgFor, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ViewEncapsulation } from '@angular/core';
import { BillService } from '../../services/bill.service';
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { TitleComponent } from '../title/title.component';
import { DividerComponent } from '../divider/divider.component';
import { FooterComponent } from '../footer/footer.component';
import { ContentComponent } from './content/content.component';

@Component({
  selector: 'app-stories',
  standalone: true,
  imports: [HttpClientModule, NgIf, NgFor, NgClass, InfiniteScrollModule, RouterModule, NavbarComponent, TitleComponent, DividerComponent, FooterComponent, ContentComponent],
  templateUrl: './stories.component.html',
  styleUrl: './stories.component.scss',
})
export class StoriesComponent {

  constructor(private headLineService: BillService) { }

  ngOnInit() {
  }
}
