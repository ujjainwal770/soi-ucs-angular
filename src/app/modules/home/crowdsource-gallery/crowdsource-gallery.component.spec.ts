import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedService } from 'src/app/core/services/shared.service';

import { CrowdsourceGalleryComponent } from './crowdsource-gallery.component';

describe('CrowdsourceGalleryComponent', () => {
  let component: CrowdsourceGalleryComponent;
  let fixture: ComponentFixture<CrowdsourceGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrowdsourceGalleryComponent ],
      providers: [SharedService]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrowdsourceGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    spyOn(component, 'switchViewStyle').and.callThrough();
  });

  it('should create', () => {
    console.log(`CrowdsourceGalleryComponent --> default / first test case`);
    expect(component).toBeTruthy();
  });

  it('should check #switchViewStyle()', () => {
    console.log(`CrowdsourceGalleryComponent --> should check #switchViewStyle()`);
    
    let viewStyle = "list_view";
    component.switchViewStyle(viewStyle);
    expect(component.viewStyle).toBe(viewStyle);
  });
});
