import { Component, OnInit } from '@angular/core';
import {  HttpClientModule } from '@angular/common/http';
import { BillService } from '../../services/bill.service';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-headlines',
  standalone: true,
  imports: [HttpClientModule, NgIf, NgFor],
  templateUrl: './headlines.component.html',
  styleUrl: './headlines.component.scss'
})
export class HeadlinesComponent implements OnInit {

  public headLines: any;
  constructor(private headLineService: BillService) { }

  ngOnInit() {

    this.headLineService.getHeadLines(10, 0).subscribe((response) => {
     this.headLines = response?.data?.stories
    })
  
  }

}
