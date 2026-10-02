import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'twoWords',
  standalone: true
})
export class TwoWordsPipe implements PipeTransform {
  transform(value: string | null | undefined, wordCount: number = 2): string {
    if (!value) return '-';

    const words = value.trim().split(/\s+/);
    if (words.length <= wordCount) return value;

    return words.slice(0, wordCount).join(' ') + ' ...';
  }
}
