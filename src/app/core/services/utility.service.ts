import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import moment from 'moment';
import { fromEvent, Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class UtilityService {
  private subject = new Subject<any>();
  constructor(private readonly _router: Router) { }

  routeReuseUrl () {
    return this._router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  /**
   * Searching data
   * @param ele : Input text element
   * @returns searchTerms as string
   */
  searchData (ele: any) {
    const searchTerms = fromEvent<any>(ele, 'keyup').pipe(
      map(event => event.target.value.trim()),
      debounceTime(500),
      distinctUntilChanged()
    );
    return searchTerms;
  }

  sendClickEvent(type) {
    this.subject.next(type);
  }

  getClickEvent(): Observable<any> {
      return this.subject.asObservable();
  }

  getDateDiffInDays(utcDate1, utcDate2) {
    const date1 = moment(utcDate1);
    const date2 = moment(utcDate2);

    const duration = moment.duration(date1.diff(date2));
    const days = duration.asDays();
    const diff = Math.floor(days);
    return diff;
  }
}
