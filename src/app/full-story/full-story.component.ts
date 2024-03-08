import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit, ViewEncapsulation } from '@angular/core';
import { BillService } from '../../services/bill.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ActivatedRoute, Route, Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { TitleComponent } from '../title/title.component';
import { DividerComponent } from '../divider/divider.component';
import { FooterComponent } from '../footer/footer.component';
import { DomSanitizer } from '@angular/platform-browser';
import { ContentComponent } from '../stories/content/content.component';

@Component({
  selector: 'app-full-story',
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
  templateUrl: './full-story.component.html',
  styleUrl: './full-story.component.scss',
})
export class FullStoryComponent implements OnInit {
  public _id: any;
  public bill: any;
  public billSummery: any;
  public fallbackImage = "https://d2646mjd05vkml.cloudfront.net/DALL%C2%B7E+2024-02-27+20.59.20+-+Craft+an+intricate+artwork+that+merges+Italian+Futurism+with+minimalism+to+reinterpret+the+American+flag%2C+focusing+on+a+higher+density+of+stars+while+.png"
  public isLoading: any;
  public isError: any = false;

  constructor(
    private billService: BillService,
    private route: ActivatedRoute,
    public router: Router,
    private sanitizer: DomSanitizer,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this._id = params['id'];

      if (this._id) {
        this.isLoading = true;
        this.billService.getFullStory(this._id).subscribe((data) => {
          if(!data) {
            this.isLoading = false;
            this.isError = true;
            return;
          } else {
            this.bill = data.data.bill;
            this.billSummery = data.data.billSummery;
            this.bill.twitterText = `${this.billSummery.headLine} \n
            \nRead more: https://www.otherparty.com/story/${this.bill.bill_id}
            `;

            if(this.billSummery.image) {
              this.billSummery.image = this.billSummery.image.replace('https://other-party-images.s3.amazonaws.com', 'https://d2646mjd05vkml.cloudfront.net');

            } else { 
              this.billSummery.image || this.fallbackImage 
            }

            this.isLoading = false;
            this.isError = false;
          }
        }, error => {
          this.isLoading = false;
          this.isError = true;
        });
      }
    });
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  openTwitter(username: string) {
    const url = `https://twitter.com/intent/tweet?screen_name=${username}&ref_src=twsrc%5Etfw`;
    window.open(url, '_blank');
  }

  openGovTrack(link: string) {
    const url = `${link}`;
    window.open(url, '_blank');
  }

  fallbackHome() {
    this.router.navigate(['/']);
  }
}
