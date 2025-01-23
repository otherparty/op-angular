import { Component, Renderer2 } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-terms-and-conditions',
  templateUrl: './terms-and-conditions.component.html',
  styleUrls: ['./terms-and-conditions.component.scss'],
  standalone: true,
  imports: [CommonModule]  // Import necessary Angular modules
})
export class TermsAndConditions {
  policyLoaded = false;  // Track policy load state

  constructor(private renderer: Renderer2) {}

  loadPolicy() {
    if (this.policyLoaded) return; // Prevent reloading the policy

    const policyContainer = document.getElementById('policy-container');
    if (policyContainer) {
      policyContainer.innerHTML = `
      <div id="policy" width="640" height="480"
        data-policy-key="TVZOc01EWklNV3QzTVdNeWIyYzlQUT09"  
        data-extra="h-align=left&table-style=accordion">
        Please wait while the policy is loaded. If it does not load, please 
        <a rel="nofollow" href="https://app.termageddon.com/api/policy/TVZOc01EWklNV3QzTVdNeWIyYzlQUT09?h-align=left&table-style=accordion" 
          target="_blank" 
          aria-label="View Policy">click here to view the policy</a>.
      </div>`;

      const script = this.renderer.createElement('script');
      script.src = 'https://app.termageddon.com/js/termageddon.js';
      script.async = true;
      this.renderer.appendChild(document.body, script);
      this.policyLoaded = true;
    }
  }
}
