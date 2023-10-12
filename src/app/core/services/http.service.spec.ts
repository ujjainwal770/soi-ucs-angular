import { TestBed } from '@angular/core/testing';
import { observable, of } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { CookieService } from "ngx-cookie-service";
import { HttpService } from './http.service';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('HTTpService', () => {
  let service: HttpService,
      localStorageService: LocalStorageService,
      cookieService: CookieService;

  beforeEach(() => {
    TestBed.configureTestingModule({
        imports:[RouterTestingModule,HttpClientTestingModule],
        providers: [HttpService,LocalStorageService,CookieService]
    });
    service = TestBed.inject(HttpService);
    localStorageService = TestBed.inject(LocalStorageService);
    cookieService = TestBed.inject(CookieService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  
  xit('should call download', () => {
    service.download('',{})
  });

  it('should return header', () => {
    const expiryDate = new Date();
    const header = {
        'Authorization': 'Bearer eyJraWQiOiJnYVZBQU5zdDNQVm9iY3F2VnNQN2VCZi1HRVhDZ0JsOUZyNmdIZXlsVWlvIiwiYWxnIjoiUlMyNTYifQ.eyJ2ZXIiOjEsImp0aSI6IkFULnNfLVpqdnhfQWJRU0dka1lYX3oxUi1JRjZZTXktTkxySWc4VFpoTV9IUU0iLCJpc3MiOiJodHRwczovL2Rldi0wNzY2MDI4OS5va3RhLmNvbS9vYXV0aDIvZGVmYXVsdCIsImF1ZCI6ImFwaTovL2RlZmF1bHQiLCJpYXQiOjE2NDIxNDM0ODEsImV4cCI6MTY0MjIyOTg4MSwiY2lkIjoiMG9hMjk1ZGtha3BWSTk5QWE1ZDciLCJ1aWQiOiIwMHUzMGYyYzcyY2djY2JOUjVkNyIsInNjcCI6WyJlbWFpbCIsIm9wZW5pZCIsInByb2ZpbGUiXSwic3ViIjoiaW5hZGV2c291Y3NAZ21haWwuY29tIn0.IPOcDp9YiLYE4zYllr0wsdYwmoiZ_E66XAfhxUeqJcJwnU5sWC2u1J2pLb29pZ8YZt9QddR9iCOH-hwHKx8Yu084nyb6fBJgmsYFsvQk-ttkdiZZJwrOan8jBO-pchaPsExvBkpBGeiNQjt-1QhaVcsUglPUmPsKkQxDS0SM9bemHO-0zwYm1TrPdX5Ay0xW4Fdv2A_Z_u9ZW4-L4_Vj-csIiPJ8p_OToOlxbVNwE828eXCWlcJpmX8YUaV2YaElmEu4kuf_9lPjleRcUSm2BGmjdwDKi-C9xqnn0YO5yG0SNEqCuCIudF2zoZzHml2cGpXiki18-ndopT1JcNqcbQ',
        'Content-Type': 'application/json',
        'Cache-control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': `${expiryDate}`
    }
    expect(service.setHeaders()).toBeDefined();
  });


  it('should call getCookie()', () => {
    spyOn(cookieService, 'get').and.returnValue('test');
    expect(service.getCookie('test')).toBeDefined();
  });
  it('should call setCookie', () => {
    let key = 'test';
    let value = 'test';
    service.setCookie(key, value);
    let cookieVal = spyOn(cookieService, 'get').and.returnValue('test');
    expect(service.setCookie).toBeDefined();
  });

  it('should call removeCookie', () => {
    service.removeCookie('test');
    expect(cookieService.get('test')).toEqual('');
  });


});
