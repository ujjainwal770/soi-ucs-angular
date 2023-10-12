import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-image-preview',
  templateUrl: './image-preview.component.html',
  styleUrls: ['./image-preview.component.scss']
})
export class ImagePreviewComponent {

  @Input('imageUrl') popupImageUrl;
  @Output() dismissPopup: EventEmitter<boolean> = new EventEmitter();

  onDismissImagePopup() {
    const isPopupDismissed = true;
    this.dismissPopup.emit(isPopupDismissed);
  }

}
