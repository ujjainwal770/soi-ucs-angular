import { Injectable } from '@angular/core';
import { Event, NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NavService {
  public appDrawer: any;
  public currentUrl = new BehaviorSubject<string>(undefined);
  routeUrls: any = { previousUrl: '', currentUrl: '' };

  constructor(private readonly router: Router) {
    this.onUrlChanged();
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.onUrlChanged();
        this.currentUrl.next(event.urlAfterRedirects);
      }
    });
  }

  onUrlChanged() {
    this.routeUrls = {
      previousUrl: this.routeUrls.currentUrl,
      currentUrl: this.router.routerState.snapshot.url
    }
  }

  getRouteUrl() {
    return this.routeUrls;
  }
}
