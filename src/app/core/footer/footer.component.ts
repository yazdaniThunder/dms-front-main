import {Component, EventEmitter, HostBinding, OnInit, Output} from '@angular/core';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})

export class FooterComponent implements OnInit {

    currentDate: Date = new Date();
  getversion;
  routesObject;

  @Output() clickedd: EventEmitter<any> = new EventEmitter();

  ngOnInit(): void {
    // @ts-ignore
    const {version: appVersion} = require('../../../../package.json');
    // this.getversion =this.routesObject.HOME.version+" "+appVersion;

  }

  onclickFotter() {
    this.clickedd.emit('hello');

  }

}
