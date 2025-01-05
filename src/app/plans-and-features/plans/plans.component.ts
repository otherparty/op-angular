import {
  Component,
  OnInit,
  AfterViewInit,
  CUSTOM_ELEMENTS_SCHEMA,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavbarComponent } from '../../navbar/navbar.component';
import { FooterComponent } from '../../footer/footer.component';

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './plans.component.html',
  styleUrl: './plans.component.scss',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PlansComponent implements OnInit, AfterViewInit {
  scriptLoaded = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      this.loadStripeScript();
    }
  }

  ngAfterViewInit(): void {
    if (this.scriptLoaded) {
      this.initializeStripePricingTable();
    }
  }

  loadStripeScript(): void {
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/pricing-table.js';
    script.async = true;
    script.onload = () => {
      this.scriptLoaded = true;
      this.initializeStripePricingTable();
    };
    document.body.appendChild(script);
  }

  initializeStripePricingTable(): void {
    // Logic to ensure the Stripe Pricing Table is initialized properly
    // Typically, you don't need to do anything extra, as the `<stripe-pricing-table>` will work automatically
  }
}
