import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { FooterComponent } from './footer/footer.component';
import { TitleComponent } from './title/title.component';
import { DividerComponent } from './divider/divider.component';
import { HeadlinesComponent } from './headlines/headlines.component';
import { StoriesComponent } from './stories/stories.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent, TitleComponent, DividerComponent, HeadlinesComponent, StoriesComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'Other Party';
}
