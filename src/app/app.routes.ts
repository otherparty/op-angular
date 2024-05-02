import { Routes, provideRouter, withDebugTracing } from '@angular/router';
import { FullStoryComponent } from './full-story/full-story.component';
import { ApplicationConfig } from '@angular/core';
import { StoriesComponent } from './stories/stories.component';

export const routes: Routes = [
  {
    path : '',
    component: StoriesComponent
  },
  {
    path : 'story/:id',
    component: FullStoryComponent
  },
  {
    path: "**",
    redirectTo: '/'
  }
];