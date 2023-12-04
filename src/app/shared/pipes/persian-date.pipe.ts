import { Injectable, Pipe } from '@angular/core';
import {PersianCalendarService} from '../services/persian-calendar.service';

/*
  Generated class for the PersianDate pipe.

  See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
  Angular 2 Pipes.
*/
@Pipe({
    name: 'persianDate'
})
@Injectable()
export class PersianDate {
    /**
     *
     */
    constructor(public persianCalendarService: PersianCalendarService) {

    }

    transform(value: number) {
        if(value){
            let d = new Date(value);
            return this.persianCalendarService.PersianCalendar(d);
        } else return '';
    }
}
