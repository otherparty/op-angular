import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TruncatePipe } from './pipes/truncate.pipe';

@NgModule({
  declarations: [TruncatePipe],
  imports: [CommonModule],
  exports: [TruncatePipe] // 👈 Make the pipe available in other modules
})
export class SharedModule { }
