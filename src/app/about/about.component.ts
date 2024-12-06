import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NavbarComponent } from '../navbar/navbar.component';
import { TitleComponent } from '../title/title.component';
import { DividerComponent } from '../divider/divider.component';
import { FooterComponent } from '../footer/footer.component';
import { ContentComponent } from '../stories/content/content.component';
import { AuthenticateService } from '../../services/cognito.service';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterModule, NavbarComponent, TitleComponent, DividerComponent, FooterComponent, ContentComponent],
  templateUrl: './about.component.html',
  styleUrl: './about.component.scss'
})
export class AboutComponent {
  user: any;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private readonly cognito: AuthenticateService    
  ) {
    console.log(this.router.url);
    this.user = this.cognito.getUser();
  }
}
