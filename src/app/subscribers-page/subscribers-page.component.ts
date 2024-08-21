import { NgClass, NgFor, NgIf } from '@angular/common';
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
import { Title, Meta } from '@angular/platform-browser';

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
  ],
  templateUrl: './subscribers-page.component.html',
  styleUrl: './subscribers-page.component.scss'
})
export class SubscribersPageComponent implements OnInit {

  public _id: string = '';
  public repResponse: any[] = [];
  public votedAgainstList: any[] = [];
  public votedForList: any[] = [];
  constructor(private headLineService: BillService,
    private formBuilder: FormBuilder,
    @Inject(PLATFORM_ID) private _platformId: Object,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) {

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
          console.log("🚀 ~ SubscribersPageComponent ~ this.headLineService.votedAgainstList ~ this.votedAgainstList:", this.votedAgainstList)
        })
        this.headLineService.votedForList(this._id).subscribe((response) => {
          const _response = response?.data;
          this.votedForList = _response
          console.log("🚀 ~ SubscribersPageComponent ~ this.headLineService.votedForList ~ this.votedForList:", this.votedForList)
        })
      }
    })



  }
}
