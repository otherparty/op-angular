import { Component } from '@angular/core';

@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  templateUrl: './privacy-policy.component.html',
  styleUrls: ['./privacy-policy.component.scss']
})
export class PrivacyPolicyComponent {
  policyUrl: string = 'https://app.termageddon.com/api/policy/UW5oYVNHWktOV0oyVW5sdGNWRTlQUT09?h-align=left&table-style=accordion';

  redirectToPolicy(): void {
    window.open(this.policyUrl, '_blank');
  }
}
