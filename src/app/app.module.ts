import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module'; // 👈 Import SharedModule

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    SharedModule // 👈 Now the pipe is available app-wide
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
