import { NgClass, NgFor, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { RouterModule } from '@angular/router';
import { BillService } from '../../../services/bill.service';
import { DividerComponent } from '../../divider/divider.component';
import { FooterComponent } from '../../footer/footer.component';
import { NavbarComponent } from '../../navbar/navbar.component';
import { TitleComponent } from '../../title/title.component';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged, tap } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

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
  public oldHeadlines: any
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;

  currentPage: number = 0;
  itemsPerPage: number = 15;
  searchForm: FormGroup;

  constructor(private headLineService: BillService, private formBuilder: FormBuilder) {

    this.searchForm = this.formBuilder.group({
      search: ['']
    });

    if (this.searchForm && this.searchForm.get('search')?.valueChanges) {
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
  }

  ngOnInit() {
    this.loadData('init');
  }

  public loadData = (type?: string) => {
    this.toggleLoading();
    this.headLineService
      .getHeadLines(this.itemsPerPage, this.currentPage, 'DESC')
      .subscribe({
        next: (response) => {
          if (type) this.headLines = response?.data?.stories.slice(0, 5);
          if (type) this.stories = response?.data?.stories.slice(5, 15);
          else this.stories = response?.data?.stories;

          this.oldHeadlines = this.headLines;

          for (let i = 0; i < this.stories.length; i++) {
            const story = this.stories[i];
            story.isImage = Math.round(Math.random());
            story.cSummery = this.truncate(
              story.summary,
              story.isImage ? 10 : 100
            );
            story.cStory = this.truncate(story.story, story.isImage ? 10 : 100);
          }

          const classes = ['half', 'third', 'full', 'fourth'];
          this.stories = this.assignClassesToStories(this.stories, classes);
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
          for (let i = 0; i < response?.data?.stories.length; i++) {
            const story = response?.data?.stories[i];
            story.isImage = Math.round(Math.random());
            story.cSummery = this.truncate(
              story.summary,
              story.isImage ? 10 : 100
            );
            story.cStory = this.truncate(story.story, story.isImage ? 10 : 100);
          }
          this.stories = [...this.stories, ...response?.data?.stories];
          const classes = ['half', 'third', 'full', 'fourth'];
          this.stories = this.assignClassesToStories(this.stories, classes);

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

  assignClassesToStories(array: any, classes: any) {
    let currentIndex = 0;

    for (let i = 1; i < array.length;) {
      const currentClass = classes[currentIndex];
      let increment = 0;

      if (currentClass === 'third') {
        increment = 3; // For 'third' class, assign to 3 consecutive elements
      } else if (currentClass === 'half') {
        increment = 2; // For other classes, assign to 1 element
      } else if (currentClass === 'full') {
        increment = 1;
      } else if (currentClass === 'fourth') {
        increment = 4;
      }

      // Assign the current class to the next group of elements
      for (let j = 0; j < increment && i < array.length; j++) {
        array[i].className = currentClass;
        i++;
      }

      // Move to the next class index based on the rules
      currentIndex = (currentIndex + 1) % classes.length;
    }
    return array;
  }

  openTwitter(username: string) {
    const url = `https://twitter.com/intent/tweet?screen_name=${username}&ref_src=twsrc%5Etfw`;
    window.open(url, '_blank');
  }

  changeRoute(id: string) {
    // window.open(`/story/${id}`);
    window.location.href = `/story/${id}`;
  }

  search(query: string) {
    if (!query) {
      this.isSearching = false;
      this.headLines = this.oldHeadlines;
    } else {
      this.headLineService.searchBill(query).subscribe((response) => {
        const searchResults = response?.data;
        this.isSearching = false;
        this.headLines = searchResults.slice(0, 7);
      })
    }
  }
}
