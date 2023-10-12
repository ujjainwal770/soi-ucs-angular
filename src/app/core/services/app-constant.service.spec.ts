import { TestBed } from '@angular/core/testing';

import { AppConstantService } from './app-constant.service';

describe('AppConstantService', () => {
  let service: AppConstantService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppConstantService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
