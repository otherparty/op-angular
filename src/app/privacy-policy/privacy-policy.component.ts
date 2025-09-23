import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent {
  policyUrl: string = 'https://app.termageddon.com/api/policy/UW5oYVNHWktOV0oyVW5sdGNWRTlQUT09?h-align=left&table-style=accordion';
  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  redirectToPolicy(): void {
    if (!this.isBrowser) {
      return;
    }
    window.open(this.policyUrl, '_blank');
  }
}
