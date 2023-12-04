import {Pipe, PipeTransform} from "@angular/core";
import {DomSanitizer} from "@angular/platform-browser";
@Pipe({ name: 'safeHtml'})
export class SafeHtmlPipe implements PipeTransform  {
  constructor(private sanitized: DomSanitizer) {}
  transform(value) {
    let re = /&nbsp;/gi;
    if (value){
      value = value.replace(re, " ");
    }
    return this.sanitized.bypassSecurityTrustResourceUrl(value);
  }
}
