import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, inject, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { NavService } from 'src/app/core/services/nav.service';
import { UserListComponent } from 'src/app/modules/home/app-users/user-list/user-list.component';
import { SchoolListComponent } from 'src/app/modules/home/school-management/school-list/school-list.component';

import { MenuListItemComponent } from './menu-list-item.component';

describe('MenuListItemComponent', () => {
  let component: MenuListItemComponent;
  let fixture: ComponentFixture<MenuListItemComponent>;
  let navService: NavService;
  let mockdata: any = [];
  let router: Router;
  let nav = new BehaviorSubject<string>(undefined);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MenuListItemComponent],
      providers: [NavService],
      imports: [
        RouterTestingModule.withRoutes([
          { path: 'school-management', component: SchoolListComponent },
        ]),
        BrowserAnimationsModule,],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
    navService = TestBed.inject(NavService);

    nav.next('/dashboard');
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MenuListItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(component, 'onItemSelected').and.callThrough();
    router = TestBed.inject(Router);
  });

  // it('should check ngOnInit()', () => {
  //   component.ngOnInit();
  //   const mockCurrentUrl = '/school-management';
  //   (navService as any).currentUrl = of(mockCurrentUrl);
  //   navService.currentUrl.subscribe((url: string) => {
  //     expect(component.ariaExpanded).toBe(component.expanded);
  //   });
  // });

  xit('should check onItemSelected() when child url not avaialble', () => {
    const item = {
      module: "School",
      url: "/school-management",
      icon: "line_style",
      access: "Soucsadmin"
    };
    component.onItemSelected(item);
    fixture.detectChanges();
    spyOn(router, 'navigate').and.callThrough();
    expect(router.navigate).toBeDefined();
  });

  xit('should call onItemSelected() when child url avaialble', () => {
    const item = {
      "module": "Users",
      "url": "/app-users",
      "icon": "cloud",
      "access": "Soucsadmin",
      "child": [
        {
          "module": "User List",
          "url": "/app-users/user-list",
          "access": "Soucsadmin"
        },
        {
          "module": "Report Abuse",
          "url": "/app-users/report-abuse",
          "access": "Soucsadmin"
        }
      ]
    };
    component.onItemSelected(item);
    fixture.detectChanges();
    expect(item.child.length).toBeGreaterThan(0);
    expect(component.expanded).toBe(!component.expanded);
  });
});
