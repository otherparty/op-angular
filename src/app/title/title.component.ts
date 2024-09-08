import { Component, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { DividerComponent } from '../divider/divider.component';
import { ContentComponent } from '../stories/content/content.component';
import { BillService } from '../../services/bill.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { isPlatformServer } from '@angular/common';
@Component({
  selector: 'app-title',
  standalone: true,

  imports: [DividerComponent, ReactiveFormsModule],
  templateUrl: './title.component.html',
  styleUrl: './title.component.scss',
})
export class TitleComponent {
  @ViewChild(ContentComponent) _component!: ContentComponent;

  public tabs = [
    // { name: "Recent Votes", checked: false },
    { name: 'Latest', checked: true },
    { name: 'Business', checked: false },
    { name: 'Military', checked: false },
    { name: 'Education', checked: false },
    { name: 'Technology', checked: false },
    { name: 'Healthcare', checked: false },
    { name: 'Environment', checked: false },
  ];
  constructor(
    private formBuilder: FormBuilder,
    private api: BillService,
    @Inject(PLATFORM_ID) private _platformId: Object
  ) {
    if (isPlatformServer(this._platformId)) {
      return;
    }
  }

  getDataBasedOnTags(tab: any) {
    this.tabs.map((t) => {
      t.checked = t.name === tab.name ? true : false;
    });
    this.api.callXFunction(tab);
  }
}
