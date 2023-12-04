import {Pipe, PipeTransform} from '@angular/core';


@Pipe({
  name: 'CheckCharValidPipe'
})
export class CheckCharValidPipe implements PipeTransform {

  private smallSize: number = 30;

  transform(text: string): string {
    if (text === undefined) { return ''; }
    if (text === '') { return ''; }

    const lengthOfText = text.length;
    if (lengthOfText <= this.smallSize) {
           return text;
    }
    // when lengthOFText is greater than 30 char
    else{
     text = text.substring(0, this.smallSize - 1);
      const lastChar = text.charAt(lengthOfText - 1);
      if ( lastChar === ' ' || lastChar === '.') {
        return text + " ";
      } else {
        const indexOfLastSpace = text.lastIndexOf(' ');
        text = text.substring(0, indexOfLastSpace);
        return text + " ";
      }
    }

  }
}
