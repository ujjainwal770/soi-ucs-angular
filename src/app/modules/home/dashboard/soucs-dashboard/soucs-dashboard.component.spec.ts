import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { SoucsDashboardComponent } from './soucs-dashboard.component';

describe('SoucsDashboardComponent', () => {
  let component: SoucsDashboardComponent;
  let fixture: ComponentFixture<SoucsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SoucsDashboardComponent ],
      imports:[RouterTestingModule, BrowserAnimationsModule],
      providers:[LocalStorageService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SoucsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
