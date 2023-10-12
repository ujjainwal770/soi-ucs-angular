import { Component, HostListener, OnDestroy } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-video-player-dialog',
  templateUrl: './video-player-dialog.component.html',
  styleUrls: ['./video-player-dialog.component.scss']
})
export class VideoPlayerDialogComponent implements OnDestroy {
  videoData: any;
  constructor(private readonly dialogRef: MatDialogRef<VideoPlayerDialogComponent>) {
    dialogRef.disableClose = true;
  }

  @HostListener('window:keyup.esc') onKeyUp() {
    this.cancel();
  }

  ngOnDestroy() {
    this.cancel();
  }

  cancel() {
    this.dialogRef.close();
  }
}
