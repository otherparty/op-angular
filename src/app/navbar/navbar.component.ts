import { Component } from '@angular/core';
import { Directive } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthenticateService } from '../../services/cognito.service';
import { PrivacyPolicyComponent } from '../privacy-policy/privacy-policy.component';
import { TermsAndConditions } from '../terms-and-conditions/terms-and-conditions.component';
import { BillService } from '../../services/bill.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, PrivacyPolicyComponent, TermsAndConditions],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  user: any;

  constructor(
    private toastr: ToastrService,
    private readonly cognito: AuthenticateService,
    private readonly userService: BillService
  ) {
    this.user = this.cognito.getUser();
  }

  public logOut() {
    this.cognito.logOut();
  }

  public cancelSubscription() {
    this.cognito.getIdToken().then((idToken) => {
      this.userService
        .cancelForUserSubscription(idToken || '')
        .subscribe((response) => {
          this.toastr.success('User cancelled successfully', 'Success');
        });
    });
  }
}
