import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate'
})
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit: number, trail: string = '...'): string {
    if (!value || !limit) return value;
    const words = value.split(' ');
    return words.length > limit ? words.slice(0, limit).join(' ') + trail : value;
  }
}