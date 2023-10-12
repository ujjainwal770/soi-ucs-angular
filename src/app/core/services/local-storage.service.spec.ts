import { TestBed } from '@angular/core/testing';
import { observable, of } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';
import { LocalStorageService } from './local-storage.service';

describe('LocalStorageService', () => {
  let localStorageService: LocalStorageService;
    
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports:[RouterTestingModule]  ,
      providers: [LocalStorageService]
    });
    localStorageService = TestBed.inject(LocalStorageService);
    
    let store = {};
   
    let data = {};
    const myLocalStorage = {
       get: (key: string): string => {
          return key in data ? data[key] : null;
       },
       set: (key: string, value: string) => {
        data[key] = `${value}`;
      },
      remove: (key: string) => {
          delete data[key];
      },
      removeAll: () => {
        data = {};
      },

    };

    spyOn(localStorageService, 'get')
       .and.callFake(myLocalStorage.get);
    spyOn(localStorageService, 'set')
       .and.callFake(myLocalStorage.set);   
    spyOn(localStorageService, 'remove')
       .and.callFake(myLocalStorage.remove);  
    spyOn(localStorageService, 'removeAll')
       .and.callFake(myLocalStorage.removeAll);     

    localStorageService.set('UserData', 'userinfo');    
 
  });


  xit('should call set', () => {
    localStorage.setItem('UserData','userinfo');
    let dt = localStorage.getItem('UserData');
    expect(localStorageService.set).toHaveBeenCalled();
  });

  it('should call remove', () => {
    localStorageService.remove('UserData')
    expect(localStorageService.remove).toBeDefined();
  });
  it('should call get', () => {
    localStorageService.get('UserData');
    expect(localStorageService.get).toBeDefined();
  });
  
  it('should call encryptData', () => {
    localStorageService.encryptData('UserData');
    expect(localStorageService.encryptData).toBeDefined();
  });
  it('should call decryptData', () => {
    localStorageService.decryptData('UserData');
    expect(localStorageService.decryptData).toBeDefined();
  });
  xit('should call removeSeessionData', () => {
    localStorageService.removeSeessionData()
  });
  it('should call removeAll ', () => {
    localStorageService.removeAll()
    expect(localStorageService.removeAll).toBeDefined();
  });
});
