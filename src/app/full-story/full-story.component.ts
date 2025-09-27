import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { BillService } from '../../services/bill.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { TitleComponent } from '../title/title.component';
import { DividerComponent } from '../divider/divider.component';
import { FooterComponent } from '../footer/footer.component';
import { DomSanitizer, Meta, Title } from '@angular/platform-browser';
import { ContentComponent } from '../stories/content/content.component';
import { AuthenticateService } from '../../services/cognito.service';
import { TruncatePipe } from '../shared/pipes/truncate.pipe';
import { isPlatformBrowser } from '@angular/common';
import { shouldShowBillTextSummary, shouldShowExpandedSummary } from '../stories/shared/story-content.utils';

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
    ContentComponent
  ],
  templateUrl: './full-story.component.html',
  styleUrls: ['./full-story.component.scss', '../stories/shared/story-cta.scss'],
  providers: [TruncatePipe]
})
export class FullStoryComponent implements OnInit {
  public _id: any;
  public bill: any;
  public billSummery: any;
  public fallbackImage = 'https://d2646mjd05vkml.cloudfront.net/DALL%C2%B7E+2024-02-27+20.59.20+-+Craft+an+intricate+artwork+that+merges+Italian+Futurism+with+minimalism+to+reinterpret+the+American+flag%2C+focusing+on+a+higher+density+of+stars+while+.png';
  public isLoading: any;
  public isError: any = false;
  public YeaText: any;
  public NayText: any;
  public user: any;
  public reps: string[] | undefined;
  public processedReps: any[];
  twitterHandles: any;
  private readonly isBrowser: boolean;
  private currentStoryId?: string;

  constructor(
    private billService: BillService,
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer,
    private title: Title,
    private meta: Meta,
    private truncatePipe: TruncatePipe,
    private readonly cognito: AuthenticateService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isBrowser = isPlatformBrowser(this.platformId);
    this.processedReps = [];
    this.user = this.cognito.getUser();
    if (this.isBrowser) {
      const storedReps = localStorage.getItem('registered-reps');
      if (storedReps) {
        try {
          const parsed = JSON.parse(storedReps);
          this.reps = Array.isArray(parsed) ? parsed : undefined;
        } catch (error) {
          console.error('Failed to parse registered reps from storage', error);
          this.reps = undefined;
        }
      }
    }
  }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const nextId = params['id'];

      if (!nextId || nextId === this.currentStoryId) {
        return;
      }

      this.loadFullStory(nextId);
    });
  }

  /**
   * Fetch a full story payload, update share/meta data, and handle error states.
   */
  private loadFullStory(id: string) {
    this.currentStoryId = id;
    this._id = id;
    this.isLoading = true;

    this.billService.getFullStory(id, this.reps).subscribe({
      next: (data) => {
        if (!data) {
          this.isLoading = false;
          this.isError = true;
          return;
        }

        this.bill = data.data;
        this.twitterHandles = data.data?.reps;
        this.billSummery = data.data?.billsummery[0];
        this.bill.twitterText = `${this.billSummery.headLine} ${this.twitterHandles.map((h: any) => `@${h}`).join(', ')} \n\nread more: https://otherparty.ai/story/${this.bill.bill_id}`;
        this.bill.YeaText = `Yea on ${this.billSummery.headLine} ${this.twitterHandles.map((h: any) => `@${h}`).join(', ')} \n\n https://otherparty.ai/story/${this.bill.bill_id}`;
        this.bill.NayText = `Nay on ${this.billSummery.headLine} ${this.twitterHandles.map((h: any) => `@${h}`).join(', ')} \n\n https://otherparty.ai/story/${this.bill.bill_id} `;

        this.bill.faceBookText = `https://otherparty.ai/story/${this.bill.bill_id}`
        const fullSummaryHtml = this.billSummery?.summary ?? '';
        const fullStoryHtml = this.billSummery?.story ?? this.bill?.story ?? '';
        const previewHtml = this.billSummery?.summary || this.billSummery?.story || '';

        const showFullSummary = shouldShowExpandedSummary(fullSummaryHtml, [previewHtml]);
        const showFullStory = shouldShowExpandedSummary(fullStoryHtml, [fullSummaryHtml, previewHtml]);

        this.bill.showFullSummary = showFullSummary;
        this.bill.showFullStory = showFullStory;

        const rawBillTextSummary = this.billSummery?.bill_text_summary ?? '';
        const showBillTextSummary = shouldShowBillTextSummary(rawBillTextSummary, {
          fullSummary: fullSummaryHtml,
          fullStory: fullStoryHtml,
          preview: previewHtml,
        });

        const normalizedBillTextSummary = showBillTextSummary ? rawBillTextSummary : null;

        this.bill.showBillTextSummary = showBillTextSummary;
        this.bill.bill_text_summary = normalizedBillTextSummary;

        if (this.billSummery) {
          this.billSummery.showBillTextSummary = showBillTextSummary;
          this.billSummery.bill_text_summary = normalizedBillTextSummary;
        }
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
      },
      error: () => {
        this.isLoading = false;
        this.isError = true;
      }
    });
  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }

  openTwitter(username: string) {
    if (!this.isBrowser) {
      return;
    }
    const url = `https://twitter.com/intent/tweet?screen_name=${username}&ref_src=twsrc%5Etfw`;
    window.open(url, '_blank');
  }

  openGovTrack(bill: any) {
    if (!this.isBrowser) {
      return;
    }
    this.cognito.getIdToken().then((idToken) => {
      if (idToken) {
        const decoded = this.parseJwt(idToken);
        const cognitoUsername = decoded['cognito:username'];
        const userReps = decoded['custom:reps'];

        this.billService
          .updateUserWithFollowBills(bill.bill_id, cognitoUsername)
          .subscribe({
            next: (response) => {
              const url = `${bill?.govtrack_url}`;
              window.open(url, '_blank');
            },
            error: (err) => console.log(err),
          });
      }
    });
  }

  private parseJwt(token: string): any {
    if (!this.isBrowser) {
      return null;
    }
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  }

  getTruncatedSummary(): string {
    const summary = this.bill?.bill_text_summary;
    return summary ? this.truncatePipe.transform(summary, 56) : '';
  }

  fallbackHome() {
    this.router.navigate(['/']);
  }

  public logOut() {
    this.cognito.logOut();
  }

}
