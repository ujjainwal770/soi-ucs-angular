import { TestBed } from '@angular/core/testing';
import { AppConstantService } from './app-constant.service';
import { SocketIoService } from './socket-io.service';

describe('SocketIoService', () => {
  let service: SocketIoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SocketIoService,
        AppConstantService
      ]
    });
    service = TestBed.inject(SocketIoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
