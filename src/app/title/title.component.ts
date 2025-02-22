import { Component, Inject, PLATFORM_ID, ViewChild } from '@angular/core';
import { DividerComponent } from '../divider/divider.component';
import { ContentComponent } from '../stories/content/content.component';
import { BillService } from '../../services/bill.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { isPlatformServer } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
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
    { name: 'Money', checked: false },
    { name: 'Energy', checked: false },
    { name: 'AI', checked: false },
    { name: 'War', checked: false },
    { name: 'Drugs', checked: false },
    // { name: 'Healthcare', checked: false },
    // { name: 'Environment', checked: false },
  ];
  public isSubscriberPage = false;
  constructor(
    private formBuilder: FormBuilder,
    private api: BillService,
    @Inject(PLATFORM_ID) private _platformId: Object,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    if (isPlatformServer(this._platformId)) {
      return;
    }

    if (!isPlatformServer(this._platformId)) {
      const path = this.router.url.split('/');
      this.isSubscriberPage = path.includes("subscriber-view");
    }

    this.api.yFunctionCalled$.subscribe(([tab, isChecked]) => {
      this.tabs.map((t) => {
        t.checked = t.name === tab.name ? true : false;
      });
    });
  }

  getDataBasedOnTags(tab: any) {
    if (this.isSubscriberPage) {
      this.tabs.map((t) => {
        t.checked = t.name === tab.name ? true : false;
      });

      this.router.navigate(['/'], {
        queryParams: {
          tab: tab.name,
        }
      });

    } else {
      this.tabs.map((t) => {
        t.checked = t.name === tab.name ? true : false;
      });
      this.api.callXFunction(tab, this.isSubscriberPage);

      this.router.navigate([], {
        queryParams: { tab: tab.name },
        queryParamsHandling: 'merge',  // Keeps existing query parameters
        replaceUrl: true               // Doesn't add a new history entry
      });
    }
  }
}
