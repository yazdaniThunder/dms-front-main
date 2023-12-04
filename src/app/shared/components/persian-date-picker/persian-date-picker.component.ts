import {ChangeDetectorRef, Component, EventEmitter, Injectable, Input, OnInit, Output, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {
  NgbDateStruct, NgbCalendar, NgbDatepickerI18n, NgbCalendarPersian, NgbDatepicker
} from '@ng-bootstrap/ng-bootstrap';
import {PersianCalendarService} from '../../services/persian-calendar.service';
import * as moment from 'jalali-moment';
import { JalaliDateCalculatorService} from "ngx-persian";
const WEEKDAYS_SHORT = ['د', 'س', 'چ', 'پ', 'ج', 'ش', 'ی'];
const MONTHS = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'];


@Injectable()
export class NgbDatepickerI18nPersian extends NgbDatepickerI18n {
  getWeekdayShortName(weekday: number) {
    return WEEKDAYS_SHORT[weekday - 1];
  }

  getMonthShortName(month: number) {
    return MONTHS[month - 1];
  }

  getMonthFullName(month: number) {
    return MONTHS[month - 1];
  }

  getDayAriaLabel(date: NgbDateStruct): string {
    return `${date.year}-${this.getMonthFullName(date.month)}-${date.day}`;
  }
}

@Component({
  selector: 'persian-date-picker',
  templateUrl: './persian-date-picker.component.html',
  styleUrls: ['./persian-date-picker.component.scss'],
  providers: [
    {provide: NgbCalendar, useClass: NgbCalendarPersian},
    {provide: NgbDatepickerI18n, useClass: NgbDatepickerI18nPersian}
  ]
})
export class PersianDatePickerComponent implements OnInit {


  @Input() public alwaysPlaceholder: boolean = false;
  @Input() public placeholder: string;
  @Output() passEntry: EventEmitter<any> = new EventEmitter();
  private _epoch: number;
  @Input()
  set epochDate(epoch: number) {
    this._epoch = epoch;
    this.ngOnInit()
  }
  get epochDate() { return this._epoch; }
  model:any;
  minDate: NgbDateStruct = {year: 1200, month:1, day: 1};
  maxDate: NgbDateStruct = {year: 1499, month:1, day: 1};
  @Input()
  disableDatePicker: boolean;
  public formGroup: FormGroup;

  constructor(private formBuilder: FormBuilder,
              private cdr: ChangeDetectorRef,
              private persianCalendarService: PersianCalendarService,
              private jalaliService: JalaliDateCalculatorService,
              private calendar: NgbCalendar) {
  }

  selectToday() {
    this.model = this.calendar.getToday();
  }

  ngOnInit() {
    this.formGroup = this.formBuilder.group({
      datePickerForm: new FormControl(''),
    });

    if (this.epochDate != null) {
      let res = this.jalaliService.convertToJalali(new Date(this._epoch));
      this.model = {year: res.year, month: res.month+1, day: res.day}
    }
  }

  emitValue() {
    this.model = '';
    this.passEntry.emit(undefined);
  }

  checkResult() {
    if (this.model && this.model.year && this.model.year > 1300 && this.model.year < 1600 &&
      this.model.month && this.model.month > 0 && this.model.month < 13 && this.model.day && this.model.day > 0 && this.model.day < 32) {
      let number = moment.from(this.model.year+'/' + this.model.month +'/' + this.model.day, 'fa', 'YYYY/MM/DD').format('YYYY/MM/DD');
      let x = new Date(+number.split("/")[0], +number.split("/")[1]-1, +number.split("/")[2] + 1);
      this.passEntry.emit(x);
    } else {
      this.passEntry.emit(undefined);
    }
    if (this.alwaysPlaceholder == true) {
      this.formGroup.reset();
      this.cdr.detectChanges();
    }
  }
}
