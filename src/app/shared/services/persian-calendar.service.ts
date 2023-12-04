import { Injectable } from "@angular/core";
import * as moment from "jalali-moment";

@Injectable({
  providedIn: "root",
})
export class PersianCalendarService {
  weekDayNames: string[] = [
    "شنبه",
    "یکشنبه",
    "دوشنبه",
    "سه شنبه",
    "چهارشنبه",
    "پنج شنبه",
    "جمعه",
  ];
  monthNames: string[] = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
  ];
  strWeekDay: string = null;
  strMonth: string = null;
  day: number = null;
  month: number = null;
  year: number = null;
  ld: number = null;
  farsiDate: string = null;

  today: Date = new Date();

  gregorianYear: number = null;
  gregorianMonth: number = null;
  gregorianDate: number = null;
  WeekDay: number = null;
  buf1: number[] = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  buf2: number[] = [0, 31, 60, 91, 121, 152, 182, 213, 244, 274, 305, 335];

  constructor() {}
  PersianCalendar(gregorianDate: Date): string {
    this.today = gregorianDate;
    this.gregorianYear = this.today.getFullYear();
    this.gregorianMonth = this.today.getMonth() + 1;
    this.gregorianDate = this.today.getDate();
    this.WeekDay = this.today.getDay();
    this.toPersian(gregorianDate);
    return (
      this.strWeekDay + " " + this.day + " " + this.strMonth + " " + this.year
    );
  }
  PersianCalendarNumericFormat(gregorianDate): string {
    const dateString = gregorianDate;
    const date = new Date(dateString);
    const convertedDate = date.toISOString().substring(0, 10);

    return moment(convertedDate).locale("fa").format("YYYY/MM/DD");
  }

  PersianCalendarNumeric(gregorianDate: Date): string {
    const dateString = gregorianDate;
    const date = new Date(dateString);
    const convertedDate = date.toISOString().substring(0, 10);

    var someDate = new Date(convertedDate);

    this.today = someDate;

    this.gregorianYear = this.today.getFullYear();
    this.gregorianMonth = this.today.getMonth() + 1;
    this.gregorianDate = this.today.getDate();
    this.WeekDay = this.today.getDay();
    this.toPersian(gregorianDate);
    return this.farsiDate;
  }

  convertEpochToJalaliString(value: number): string {
    if (value > 1000000000) {
      return moment.unix(value / 1000).format("YYYY-MM-DD");
    } else {
      return moment.unix(value).format("YYYY-MM-DD");
    }
  }
  convertJalaliStringToEpoch(value: string): number {
    let res;
    res = new Date(
      moment.from(value, "en", "YYYY-MM-DD").format("YYYY-MM-DD")
    ).getTime();
    if (res < 0) {
      res = new Date(
        moment.from(value, "fa", "YYYY-MM-DD").format("YYYY-MM-DD")
      ).getTime();
    }

    return res;
  }
  convertHijriStringToEpoch(value: string): number {
    let res;
    res = new Date(
      moment.from(value, "en", "YYYY-MM-DD").format("YYYY-MM-DD")
    ).getTime();
    if (res < 0) {
      res = new Date(
        moment.from(value, "ar", "YYYY-MM-DD").format("YYYY-MM-DD")
      ).getTime();
    }

    return res;
  }
  toPersian(gregorianDate: Date) {
    if (this.gregorianYear % 4 !== 0) {
      this.farsiDate = this.func1();
    } else {
      this.farsiDate = this.func2();
    }
    this.strMonth = this.monthNames[Math.floor(this.month - 1)];
    // this.strWeekDay = this.weekDayNames[this.WeekDay + 1];
    if (this.WeekDay === 6) {
      this.strWeekDay = this.weekDayNames[0];
    } else {
      this.strWeekDay = this.weekDayNames[this.WeekDay + 1];
    }
  }

  func1(): string {
    let day2;
    this.day = this.buf1[this.gregorianMonth - 1] + this.gregorianDate;
    if (this.day > 79) {
      this.day = this.day - 79;
      if (this.day <= 186) {
        day2 = this.day;
        this.month = day2 / 31 + 1;
        this.day = day2 % 31;
        if (day2 % 31 === 0) {
          this.month--;
          this.day = 31;
        }
        this.year = this.gregorianYear - 621;
      } else {
        day2 = this.day - 186;
        this.month = day2 / 30 + 7;
        this.day = day2 % 30;
        if (day2 % 30 === 0) {
          this.month = day2 / 30 + 6;
          this.day = 30;
        }
        this.year = this.gregorianYear - 621;
      }
    } else {
      this.ld =
        this.gregorianYear > 1996 && this.gregorianYear % 4 === 1 ? 11 : 10;
      day2 = this.day + this.ld;
      this.month = day2 / 30 + 10;
      this.day = day2 % 30;
      if (day2 % 30 === 0) {
        this.month--;
        this.day = 30;
      }
      this.year = this.gregorianYear - 622;
    }
    const fullDate = this.year + "/" + Math.floor(this.month) + "/" + this.day;
    return fullDate;
  }

  func2(): string {
    let day2;
    this.day = this.buf2[this.gregorianMonth - 1] + this.gregorianDate;
    this.ld = this.gregorianYear >= 1996 ? 79 : 80;
    if (this.day > this.ld) {
      this.day = this.day - this.ld;
      if (this.day <= 186) {
        day2 = this.day;
        this.month = day2 / 31 + 1;
        this.day = day2 % 31;
        if (day2 % 31 === 0) {
          this.month--;
          this.day = 31;
        }
        this.year = this.gregorianYear - 621;
      } else {
        day2 = this.day - 186;
        this.month = day2 / 30 + 7;
        this.day = day2 % 30;
        if (day2 % 30 === 0) {
          this.month--;
          this.day = 30;
        }
        this.year = this.gregorianYear - 621;
      }
      const fullDate =
        this.year + "/" + Math.floor(this.month) + "/" + this.day;
      return fullDate;
    } else {
      day2 = this.day + 10;
      this.month = day2 / 30 + 10;
      this.day = day2 % 30;
      if (day2 % 30 === 0) {
        this.month--;
        this.day = 30;
      }
      this.year = this.gregorianYear - 622;
    }
  }

  getDate(sendDate: any) {
    if (sendDate == null) {
      return "-";
    } else {
      var someDate = new Date(sendDate);
      return this.PersianCalendarNumeric(someDate);
    }
  }
}
