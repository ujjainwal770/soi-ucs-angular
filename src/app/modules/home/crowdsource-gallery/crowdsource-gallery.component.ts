import { Component } from '@angular/core';
import { SharedService } from '../../../core/services/shared.service';

@Component({
  selector: 'app-crowdsource-gallery',
  templateUrl: './crowdsource-gallery.component.html',
  styleUrls: ['./crowdsource-gallery.component.scss']
})
export class CrowdsourceGalleryComponent {
  // grid_view / list_view
  viewStyle = this._sharedService.crowdsourceListActiveViewStyle;
  tabDetails: any = {
    tabs: [
      { type: 'newuploads', name: 'New Uploads' },
      { type: 'visited', name: 'Visited' },
      { type: 'reported', name: 'Reported' }
    ],
    // Default
    selectedTabIndex: this._sharedService.crowdsourceListActiveTabIndex
  };
  constructor(
    private readonly _sharedService: SharedService
  ) { }

  switchViewStyle(viewStyle) {
    this.viewStyle = viewStyle;
  }
}
