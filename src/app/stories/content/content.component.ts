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
import { BillService } from '../../../services/bill.service';
import { DividerComponent } from '../../divider/divider.component';
import { FooterComponent } from '../../footer/footer.component';
import { NavbarComponent } from '../../navbar/navbar.component';
import { TitleComponent } from '../../title/title.component';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { Title, Meta } from '@angular/platform-browser';
import { AuthenticateService } from '../../../services/cognito.service';

@Component({
  selector: 'app-content',
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
  templateUrl: './content.component.html',
  styleUrl: './content.component.scss',
})
export class ContentComponent implements OnInit {
  public stories: any;
  public headLines: any;
  public isLoading: any;
  public isSearching: any;
  public oldHeadlines: any;

  user: any;
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;
  test: any = [];

  currentPage: number = 0;
  itemsPerPage: number = 20;
  searchForm: FormGroup;
  public fallbackImage =
    'https://d2646mjd05vkml.cloudfront.net/DALL%C2%B7E+2024-02-27+20.59.20+-+Craft+an+intricate+artwork+that+merges+Italian+Futurism+with+minimalism+to+reinterpret+the+American+flag%2C+focusing+on+a+higher+density+of+stars+while+.png';

  public repsNames: any;

  constructor(
    private readonly headLineService: BillService,
    private readonly formBuilder: FormBuilder,
    @Inject(PLATFORM_ID) private readonly _platformId: Object,
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly cdr: ChangeDetectorRef,
    private readonly title: Title,
    private readonly meta: Meta,
    private readonly cognito: AuthenticateService 
  ) {
    this.searchForm = this.formBuilder.group({
      search: [''],
    });

    this.user = this.cognito.getUser();

    if (this.searchForm?.get('search')?.valueChanges) {
      (this.searchForm.get('search') as FormControl)?.valueChanges
        .pipe(
          tap(() => {
            this.isSearching = true;
          }),
          debounceTime(500),
          distinctUntilChanged()
        )
        .subscribe((value: any) => {
          this.search(value);
        });
    }

    if (isPlatformServer(this._platformId)) {
      return;
    } else {
      /**
       * Restore search results
       */
      this.loadData('init');
    }

    this.headLineService.xFunctionCalled$.subscribe((tab) => {
      this.getDataBasedOnTags(tab);
    });

    this.route.queryParams.subscribe(queryParams => {
      this.headLineService.callYFunction({ name: queryParams['tab'] }, true)
      this.getDataBasedOnTags({ name: queryParams['tab'] });
    });

   }

  ngOnInit() { }

  public filterStories = (stories: any, type?: string) => {
    this.stories = stories.filter((story: any) => story);

    this.oldHeadlines = this.headLines;

    for (let i = 0; i < this.stories?.length; i++) {
      const story = this.stories[i];
      if (story.image) {
        story.image = story.image.replace(
          'https://other-party-images.s3.amazonaws.com',
          'https://d2646mjd05vkml.cloudfront.net'
        );
      } else {
        story.image = this.fallbackImage;
      }
      story.headLine = story?.billsummery[0]?.headLine;
      story.isImage = Math.round(Math.random());
      story.cSummery = this.truncate(story?.billsummery[0]?.summary, story.isImage ? 30 : 100);
      story.latest_major_action = this.truncate(story.latest_major_action, 20);
      story.cStory = this.truncate(story.story, story.isImage ? 10 : 100);
      this.isSearching = false;
      this.isLoading = false;
    }

    this.stories = this.assignClassesToStories(this.stories);
  };

  public loadData = (type?: string) => {
    this.toggleLoading();
    this.headLineService
      .getHeadLines(this.itemsPerPage, this.currentPage, 'DESC')
      .subscribe({
        next: (response) => {
          this.filterStories(response?.data, type);
        },
        error: (err) => console.log(err),
        complete: () => this.toggleLoading(),
      });
  };

  toggleLoading = () => (this.isLoading = !this.isLoading);

  appendData = () => {
    this.toggleLoading();
    this.headLineService
      .getHeadLines(this.itemsPerPage, this.currentPage, 'DESC')
      .subscribe({
        next: (response) => {
          for (let i = 0; i < response?.data?.length; i++) {
            const story :any = response?.data[i];
            if (story.image) {
              story.image = story.image.replace(
                'https://other-party-images.s3.amazonaws.com',
                'https://d2646mjd05vkml.cloudfront.net'
              );
            } else {
              story.image = this.fallbackImage;
            }

            story.isImage = Math.round(Math.random());
            story.cSummery = this.truncate(
              story.billsummery[0]?.summary,
              story.isImage ? 10 : 100
            );
            story.latest_major_action = this.truncate(
              story.latest_major_action,
              20
            );
            story.cStory = this.truncate(story.story, story.isImage ? 10 : 100);
          }
          if (response?.data) {
            this.stories = [...this.stories, ...response.data];
          }
          this.stories = this.assignClassesToStories(this.stories);

          this.oldHeadlines = this.headLines;
        },
        error: (err) => console.log(err),
        complete: () => this.toggleLoading(),
      });
  };

  truncate(value: string, limit: number): string {
    const words = value?.split(' ');
    if (words?.length > limit) {
      return words?.slice(0, limit).join(' ') + '...';
    } else {
      return value;
    }
  }

  onScroll = () => {
    this.currentPage++;
    this.appendData();
  };

  assignClassesToStories(array: any) {
  
    let i = 0;
    while (i < array.length) {
        // Assign 'half' to the next two elements, if available.
        for (let j = 0; j < 2 && i < array.length; j++, i++) {
            array[i].className = 'half';
        }

        // Assign 'third' to the next three elements, if available.
        for (let j = 0; j < 3 && i < array.length; j++, i++) {
            array[i].className = 'third';
        }
    }

    return array;
  }

  openTwitter(username: string) {
    const url = `https://twitter.com/intent/tweet?screen_name=${username}&ref_src=twsrc%5Etfw`;
    window.open(url, '_blank');
  }

  changeRoute(id: string) {
    // this.router.navigate([`/story/${id}`]);
    // this.cdr.detectChanges();
    window.open(`/story/${id}`, '_blank')
  }

  search(query: string) {
    if (!query) {
      this.isSearching = false;
      this.headLines = this.oldHeadlines;
      this.loadData('init');
    } else {
      if (isPlatformServer(this._platformId)) {
        console.log('Server only code.');

        // https://github.com/angular/universal#universal-gotchas
      }

      this.headLineService.searchBill(query).subscribe((response) => {
        const searchResults = response?.data;
        this.isSearching = false;
        this.filterStories(searchResults, '');
        this.cdr.detectChanges();
      });

      this.headLineService.searchForReps(query).subscribe((response) => {
        const reps = response?.data;

        this.repsNames = reps.map((r: any) => {
          return {
            id: r._id,
            name: `${r.account.first_name} ${r.account.last_name}`,
          };
        });
      });
    }
  }

  getDataBasedOnTags(query: any) {
    if (!query) {
      this.isSearching = false;
      this.headLines = this.oldHeadlines;
      return;
    } else {
      if (isPlatformServer(this._platformId)) {
        console.log('Server only code.');
        // https://github.com/angular/universal#universal-gotchas
      }

      if(!query.name) {
        return;
      }

      if (query.name === 'Latest') {
        this.isSearching = true;
        this.isLoading = true;
        this.loadData('init');
        return;
      }

      this.isSearching = true;
      this.headLineService.searchBill(query.name).subscribe((response) => {
        const searchResults = response?.data;
        this.filterStories(searchResults, '');

        this.isSearching = false;
        this.headLines = searchResults;
        this.cdr.detectChanges();
        return;
      });
    }
  }

  public logOut() {
    this.cognito.logOut();
  }

  onImgError(event: any) {
    event.target.src = this.fallbackImage;
  }
}
