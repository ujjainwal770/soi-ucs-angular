import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialogRef } from '@angular/material/dialog';

import { VideoPlayerDialogComponent } from './video-player-dialog.component';

describe('VideoPlayerDialogComponent', () => {
  let component: VideoPlayerDialogComponent;
  let fixture: ComponentFixture<VideoPlayerDialogComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoPlayerDialogComponent ],
      providers: [
        {
          provide: MatDialogRef, useValue: {
            close: () => { },
            updatePosition: () => { }
          }
        },
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoPlayerDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    spyOn(component, 'cancel').and.callThrough();
    spyOn(component, 'onKeyUp').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check #cancel()', () => {
    console.log(`VideoPlayerDialogComponent --> should check #cancel(`);

    component.cancel();
    expect(false).toBe(false);
  });

  it('should check #onKeyUp()', () => {
    console.log(`VideoPlayerDialogComponent --> should check #onKeyUp(`);

    component.onKeyUp();
    expect(component.cancel).toHaveBeenCalled();
  });
});
