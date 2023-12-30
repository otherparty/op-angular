import { NgClass, NgFor, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ViewEncapsulation } from '@angular/core';
import { BillService } from '../../services/bill.service';
import { InfiniteScrollModule } from "ngx-infinite-scroll";

@Component({
  selector: 'app-stories',
  standalone: true,
  imports: [HttpClientModule, NgIf, NgFor, NgClass, InfiniteScrollModule],
  templateUrl: './stories.component.html',
  styleUrl: './stories.component.scss',
})
export class StoriesComponent {
  public stories: any;
  public headLines: any;
  public isLoading: any;
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;

  currentPage: number = 0;
  itemsPerPage: number = 15;

  constructor(private headLineService: BillService) { }

  ngOnInit() {
    this.loadData('init')
  }

  public loadData = (type?: string) => {
    this.toggleLoading();
    this.headLineService.getHeadLines(this.itemsPerPage, this.currentPage, 'DESC').subscribe({
      next: response => {
        if (type) this.headLines = response?.data?.stories.slice(0, 5);
        if (type) this.stories = response?.data?.stories.slice(5, 15);
        else this.stories = response?.data?.stories

        const classes = ['half', 'third', 'full', 'fourth'];
        this.stories =  this.assignClassesToStories(this.stories, classes);
      },
      error: err => console.log(err),
      complete: () => this.toggleLoading()
    })
  }

  toggleLoading = () => this.isLoading = !this.isLoading;

  appendData = () => {
    this.toggleLoading();
    this.headLineService.getHeadLines(this.itemsPerPage, this.currentPage, 'DESC').subscribe({
      next: response => {
        this.stories = [...this.stories, ...response?.data?.stories];
        const classes = ['half', 'third', 'full', 'fourth'];
        this.stories =  this.assignClassesToStories(this.stories, classes);
      },
      error: err => console.log(err),
      complete: () => this.toggleLoading()
    })
  }

  onScroll = () => {
    this.currentPage++;
    this.appendData();
  }

   assignClassesToStories(array: any, classes:any) {
    let currentIndex = 0;
  
    for (let i = 1; i < array.length; ) {
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

}
