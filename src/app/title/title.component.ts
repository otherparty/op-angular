import { Component } from '@angular/core';
import { DividerComponent } from '../divider/divider.component';
import { BillService } from '../../services/bill.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-title',
  standalone: true,

  imports: [DividerComponent, ReactiveFormsModule],
  templateUrl: './title.component.html',
  styleUrl: './title.component.scss'
})
export class TitleComponent {

  searchForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private api: BillService) {
    this.searchForm = this.formBuilder.group({
      search: ['']
    });

    if (this.searchForm && this.searchForm.get('search')?.valueChanges) {
      (this.searchForm.get('search') as FormControl)?.valueChanges
        .pipe(
          debounceTime(500), 
          distinctUntilChanged()
        )
        .subscribe(value => {
          this.search(value); 
        });
    }

  }

  search(query: string) {
    this.api.searchBill(query).subscribe((response) => {
      console.log("🚀 ~ TitleComponent ~ this.api.searchBill ~ response:", response)
    })
  }

}
