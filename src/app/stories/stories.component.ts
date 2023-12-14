import { NgClass, NgFor, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, ViewEncapsulation } from '@angular/core';
import { BillService } from '../../services/bill.service';

@Component({
  selector: 'app-stories',
  standalone: true,
  imports: [HttpClientModule, NgIf, NgFor, NgClass],
  templateUrl: './stories.component.html',
  styleUrl: './stories.component.scss',
})
export class StoriesComponent {
  public stories: any;
  public headLines: any;

  constructor(private headLineService: BillService) {}

  ngOnInit() {
    this.headLineService.getHeadLines(5, 0, 'DESC').subscribe((response) => {
      this.headLines = response?.data?.stories;
    });

    this.headLineService.getHeadLines(10, 1, 'DESC').subscribe((response) => {
      this.stories = response?.data?.stories;
    });
  }
}
