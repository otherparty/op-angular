import { Component } from '@angular/core';
import { Directive } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthenticateService } from '../../services/cognito.service';
import { PrivacyPolicyComponent } from '../privacy-policy/privacy-policy.component';
import { TermsAndConditions } from '../terms-and-conditions/terms-and-conditions.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule, PrivacyPolicyComponent, TermsAndConditions],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  user: any;
 
  constructor(private readonly cognito: AuthenticateService) {
    this.user = this.cognito.getUser();
  }

  public logOut() {
    this.cognito.logOut();
  }

}
