import { TestBed } from '@angular/core/testing';
import { observable, of } from 'rxjs';
import { HttpClientModule, } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing'
import { AppSettingsService } from './app-settings.service';

describe('AppSettingsService', () => {
  let appSettingService: AppSettingsService,
      httpTestingController: HttpTestingController,
      mockHttpClient;
      let mockdata = [] 
  beforeEach(() => {
    mockdata = [{
      'icon': "dashboard",
      'module': "Dashboard",
      'url': "/dashboard"
    }]

    TestBed.configureTestingModule({
      imports:[HttpClientTestingModule, HttpClientModule]  ,
      providers: [AppSettingsService]
    });

   // appSettingService = new AppSettingsService(mockHttpClient);
   appSettingService = TestBed.inject(AppSettingsService);
   httpTestingController = TestBed.inject(HttpTestingController);

   spyOn(appSettingService, 'getJSON').and.returnValue(of(mockdata));
  });

  it('should return nav list item', () => {
    let response = [];
    appSettingService.getJSON().subscribe(res => { 
      response = res;
    });
    expect(response).toEqual(mockdata);
  });
});
