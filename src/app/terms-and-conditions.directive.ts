import { Directive, ElementRef, HostListener, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appTermsAndConditions]'
})
export class TermsAndConditions {

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('click') onClick() {
    this.loadTerms();
  }

  private loadTerms() {
    // Remove existing children (if any) and insert the policy content
    this.el.nativeElement.innerHTML = `
      <div id="policy" width="640" height="480"
        data-policy-key="TVZOc01EWklNV3QzTVdNeWIyYzlQUT09"  
        data-extra="h-align=left&table-style=accordion">
        Please wait while the policy is loaded. If it does not load, please 
        <a rel="nofollow" href="https://app.termageddon.com/api/policy/TVZOc01EWklNV3QzTVdNeWIyYzlQUT09?h-align=left&table-style=accordion" 
          target="_blank" 
          aria-label="View Policy">click here to view the policy</a>.
      </div>`;

    // Dynamically load the script
    const script = this.renderer.createElement('script');
    script.src = 'https://app.termageddon.com/js/termageddon.js';
    script.async = true;
    this.renderer.appendChild(this.el.nativeElement, script);
  }
}