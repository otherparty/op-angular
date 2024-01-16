import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BillService } from '../../services/bill.service';
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { ActivatedRoute, Route, RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { TitleComponent } from '../title/title.component';
import { DividerComponent } from '../divider/divider.component';
import { FooterComponent } from '../footer/footer.component';
import { DomSanitizer } from '@angular/platform-browser';
import { ContentComponent } from '../stories/content/content.component';


@Component({
  selector: 'app-full-story',
  standalone: true,
  imports: [HttpClientModule, NgIf, NgFor, NgClass, InfiniteScrollModule, RouterModule, NavbarComponent, TitleComponent, DividerComponent, FooterComponent, DatePipe, ContentComponent],
  templateUrl: './full-story.component.html',
  styleUrl: './full-story.component.scss'
})
export class FullStoryComponent implements OnInit {
  public _id: any;
  public bill: any;
  public billSummery: any;

  constructor(private billService: BillService, private route: ActivatedRoute, private sanitizer: DomSanitizer) {
 
  }

  ngOnInit(): void {
    
    this.route.params.subscribe(params => {
      this._id = params['id'];
    });
    
    if (this._id) {
      this.billService.getFullStory(this._id).subscribe((data) => {
        this.bill = data.data.bill;
        this.billSummery = data.data.billSummery;
      })
    }
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  openTwitter(username: string) {
    const url = `https://twitter.com/intent/tweet?screen_name=${username}&ref_src=twsrc%5Etfw`
    window.open(url, '_blank');
  }

}
