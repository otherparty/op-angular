import { NgClass, NgFor, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ViewEncapsulation } from '@angular/core';
import { BillService } from '../../services/bill.service';
import { HeadlinesComponent } from '../headlines/headlines.component';

@Component({
  selector: 'app-stories',
  standalone: true,
  imports: [HttpClientModule, NgIf, NgFor, NgClass, HeadlinesComponent],
  templateUrl: './stories.component.html',
  styleUrl: './stories.component.scss',
})
export class StoriesComponent {
  public stories: any;
  public headLines: any;

  constructor(private headLineService: BillService) {}

  ngOnInit() {
    this.headLineService.getHeadLines(10, 1).subscribe((response) => {
      this.headLines = response?.data?.stories;
    });

    this.headLineService.getHeadLines(10, 0).subscribe((response) => {
      this.stories = response?.data?.stories;
    });
  }
}
