import { DatePipe, NgClass, NgFor, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  Inject,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BillService } from '../../services/bill.service';
import { DividerComponent } from '../divider/divider.component';
import { FooterComponent } from '../footer/footer.component';
import { NavbarComponent } from '../navbar/navbar.component';
import { TitleComponent } from '../title/title.component';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Title, Meta, DomSanitizer } from '@angular/platform-browser';
import { AuthenticateService } from '../../services/cognito.service';

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
    ReactiveFormsModule,
    DatePipe
    ],
  templateUrl: './subscribers-page.component.html',
  styleUrl: './subscribers-page.component.scss'
})
export class SubscribersPageComponent implements OnInit {

  public _id: string = '';
  public repResponse: any[] = [];
  public votedAgainstList: any[] = [];
  public votedForList: any[] = [];
  public votedSponsoredCosponsoredList: any[] = [];
  public isLoading: any;
  public isError: any;
  public bill: any;
  public billSummery: any;
  public fallbackImage = "https://d2646mjd05vkml.cloudfront.net/DALL%C2%B7E+2024-02-27+20.59.20+-+Craft+an+intricate+artwork+that+merges+Italian+Futurism+with+minimalism+to+reinterpret+the+American+flag%2C+focusing+on+a+higher+density+of+stars+while+.png"
  public user: any;
  public reps: any;
  public processedReps: any[];

  constructor(private headLineService: BillService,
    private formBuilder: FormBuilder,
    @Inject(PLATFORM_ID) private _platformId: Object,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private billService: BillService,
    private sanitizer: DomSanitizer,
    private title: Title,
    private meta: Meta,
    private readonly cognito: AuthenticateService    

  ) {
    this.processedReps = [];
    this.user = this.cognito.getUser();
    this.reps = localStorage.getItem('registered-reps');
  }

  ngOnInit() {

    this.route.params.subscribe((params) => {
      this._id = params['id'];
      if (this._id) {
        this.headLineService.getSubscriberDetails(this._id).subscribe((response) => {
          const _response = response?.data;
          this.repResponse = Object.keys(_response).map(key => _response[key]);
        })
        this.headLineService.votedAgainstList(this._id).subscribe((response) => {
          const _response = response?.data;
          this.votedAgainstList = _response
        })
        this.headLineService.votedForList(this._id).subscribe((response) => {
          const _response = response?.data;
          this.votedForList = _response
        })
        this.headLineService.votedSponsoredCosponsoredList(this._id).subscribe((response) => {
          const _response = response?.data;
          this.votedSponsoredCosponsoredList = _response
        })
      }
    })
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

  getStory(bill:any) {
    this.isLoading = true;
    this.bill = null;
    this.billSummery = null;

    this.billService.getFullStory(bill.bill_id, this.reps).subscribe((data) => {
      if (!data) {
        this.isLoading = false;
        this.isError = true;
        return;
      } else {
        this.bill = data.data;
        this.billSummery = data.data?.billsummery[0];
        this.bill.twitterText = `${this.billSummery.headLine} \n\nread more: https://otherparty.ai/story/${this.bill.bill_id}`;
        this.bill.faceBookText = `https://otherparty.ai/story/${this.bill.bill_id}`

        if (this.billSummery.image) {
          this.billSummery.image = this.billSummery.image.replace('https://other-party-images.s3.amazonaws.com', 'https://d2646mjd05vkml.cloudfront.net');

        } else {
          this.billSummery.image = this.billSummery.image || this.fallbackImage
        }

        window.scroll({ 
          top: 0, 
          left: 0, 
          behavior: 'smooth' 
        });

        this.isLoading = false;
        this.isError = false;
      }
    }, error => {
      this.isLoading = false;
      this.isError = true;
    });
  }

}
