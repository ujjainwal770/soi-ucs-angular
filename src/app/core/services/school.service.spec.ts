import { TestBed } from '@angular/core/testing';
import { observable, of } from 'rxjs';

import { SchoolService } from './school.service';

describe('SchoolService', () => {
  let service: SchoolService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SchoolService]
    });
    service = TestBed.inject(SchoolService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
  it('should call sendMessage', () => {
    service.sendMessage({})
  });
  it('should call getMessage', () => {
    service.getMessage()
  });

});
