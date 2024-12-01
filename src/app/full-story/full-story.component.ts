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
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { ContentComponent } from '../stories/content/content.component';
import { AuthenticateService } from '../../services/cognito.service';

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
  user: any;

  constructor(
    private billService: BillService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private title: Title,
    private meta: Meta,
    private readonly cognito: AuthenticateService    
  ) {
    console.log(this.router.url);
    this.user = this.cognito.getUser();
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this._id = params['id'];

      if (this._id) {
        this.isLoading = true;
        this.billService.getFullStory(this._id).subscribe((data) => {
          if (!data) {
            this.isLoading = false;
            this.isError = true;
            return;
          } else {
            this.bill = data.data;
            this.billSummery = data.data?.billsummery[0];
            this.bill.twitterText = `${this.billSummery.headLine} \n\nRead more: https://otherparty.ai/story/${this.bill.bill_id}`;
            this.bill.faceBookText = `https://otherparty.ai/story/${this.bill.bill_id}`

            if (this.billSummery.image) {
              this.billSummery.image = this.billSummery.image.replace('https://other-party-images.s3.amazonaws.com', 'https://d2646mjd05vkml.cloudfront.net');

            } else {
              this.billSummery.image = this.billSummery.image || this.fallbackImage
            }

            /**
             * TODO: Add meta tags
             */
            this.title.setTitle(`Other Party | ${this.billSummery.headLine}`);

            this.meta.updateTag({ name: "description", content: this.billSummery?.summary || this.billSummery?.story });
            this.meta.updateTag({ name: "title", content: `Other Party | ${this.billSummery.headLine}` });

            this.meta.addTags([
              { name: 'twitter:site', content: '@otherpartyai' },
              { name: 'twitter:title', content: `Other Party | ${this.billSummery.headLine}` },
              { name: 'twitter:description', content: this.billSummery?.summary || this.billSummery?.story },
              { name: 'twitter:text:description', content: this.billSummery?.summary || this.billSummery?.story },
              { name: 'twitter:image', content: 'https://otherparty.ai/assets/img/logo.png' },

              { name: 'og:type', content: 'website' },
              { name: 'og:url', content: `https://otherparty.ai${this.router.url}` },
              { name: 'og:title', content: `Other Party | ${this.billSummery.headLine}` },
              { name: 'og:description', content: this.billSummery?.summary || this.billSummery?.story },
              { name: 'og:image', content: this.billSummery.image },

            ], true);

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

  public logOut() {
    this.cognito.logOut();
  }

}
