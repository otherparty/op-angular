import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthenticateService } from '../../services/cognito.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule],
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
