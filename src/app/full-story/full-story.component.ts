import { NgClass, NgFor, NgIf } from '@angular/common';
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


@Component({
  selector: 'app-full-story',
  standalone: true,
  imports: [HttpClientModule, NgIf, NgFor, NgClass, InfiniteScrollModule, RouterModule, NavbarComponent, TitleComponent, DividerComponent, FooterComponent],
  templateUrl: './full-story.component.html',
  styleUrl: './full-story.component.scss'
})
export class FullStoryComponent implements OnInit {
  public _id: any;
  public bill: any;
  public billSummery: any;

  constructor(private billService: BillService, private route: ActivatedRoute, private sanitizer: DomSanitizer) {
    this.route.params.subscribe(params => {
      this._id = params['id'];
    });
  }

  ngOnInit(): void {

    console.log(this._id);
    if (this._id) {
      this.billService.getFullStory(this._id).subscribe((data) => {
        this.bill = data.data.bill;
        this.billSummery = data.data.billSummery;
        console.log(this.bill);

      })

    }

  }

  sanitize(url: string) {
    return this.sanitizer.bypassSecurityTrustUrl(url);
  }



}
