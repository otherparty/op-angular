import { NgClass, NgFor, NgIf } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { InfiniteScrollModule } from "ngx-infinite-scroll";
import { RouterModule } from "@angular/router";
import { BillService } from "../../../services/bill.service";
import { DividerComponent } from "../../divider/divider.component";
import { FooterComponent } from "../../footer/footer.component";
import { NavbarComponent } from "../../navbar/navbar.component";
import { TitleComponent } from "../../title/title.component";
@Component({
  selector: "app-content",
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
  ],
  templateUrl: "./content.component.html",
  styleUrl: "./content.component.scss",
})
export class ContentComponent implements OnInit {
  public stories: any;
  public headLines: any;
  public isLoading: any;
  throttle = 300;
  scrollDistance = 1;
  scrollUpDistance = 2;

  currentPage: number = 0;
  itemsPerPage: number = 15;

  constructor(private headLineService: BillService) {}

  ngOnInit() {
    this.loadData("init");
  }

  public loadData = (type?: string) => {
    this.toggleLoading();
    this.headLineService
      .getHeadLines(this.itemsPerPage, this.currentPage, "DESC")
      .subscribe({
        next: (response) => {
          if (type) this.headLines = response?.data?.stories.slice(0, 5);
          if (type) this.stories = response?.data?.stories.slice(5, 15);
          else this.stories = response?.data?.stories;

          const classes = ["half", "third", "full", "fourth"];
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
      .getHeadLines(this.itemsPerPage, this.currentPage, "DESC")
      .subscribe({
        next: (response) => {
          this.stories = [...this.stories, ...response?.data?.stories];
          const classes = ["half", "third", "full", "fourth"];
          this.stories = this.assignClassesToStories(this.stories, classes);
        },
        error: (err) => console.log(err),
        complete: () => this.toggleLoading(),
      });
  };

  onScroll = () => {
    this.currentPage++;
    this.appendData();
  };

  assignClassesToStories(array: any, classes: any) {
    let currentIndex = 0;

    for (let i = 1; i < array.length; ) {
      const currentClass = classes[currentIndex];
      let increment = 0;

      if (currentClass === "third") {
        increment = 3; // For 'third' class, assign to 3 consecutive elements
      } else if (currentClass === "half") {
        increment = 2; // For other classes, assign to 1 element
      } else if (currentClass === "full") {
        increment = 1;
      } else if (currentClass === "fourth") {
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

    for (let i = 0; i < array.length; i++) {
      array[i].isImage = Math.round(Math.random());
    }
    console.log(array);
    return array;
  }

  openTwitter(username: string) {
    const url = `https://twitter.com/intent/tweet?screen_name=${username}&ref_src=twsrc%5Etfw`;
    window.open(url, "_blank");
  }

  changeRoute(id: string) {
    window.location.href = `/story/${id}`;
  }
}
