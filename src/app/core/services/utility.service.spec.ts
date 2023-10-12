import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';

import { UtilityService } from './utility.service';

describe('UtilityService', () => {
  let service: UtilityService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[RouterTestingModule]
    });
    service = TestBed.inject(UtilityService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should return input text ', () => {
    const input = document.createElement('input');
    let txt = service.searchData(input).subscribe(res => {
      return res;
    })
    expect(txt).toBeDefined();
  });

});
