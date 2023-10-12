import { Component, ElementRef, HostListener, Input, OnChanges, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { _CONST } from '../../../../core/constants/app.constants';
import { crowdSourceGalleryQuery, fetchImageVideoUrlquery, unpublishGalleryPostQuery } from '../../../../core/query/crowdsourcing-gallery';
import { AppConstantService } from '../../../../core/services/app-constant.service';
import { CustomErrorHandlerService } from '../../../../core/services/custom-error-handler.service';
import { DialogsService } from '../../../../core/services/dialog-service';
import { SharedService } from '../../../../core/services/shared.service';
import { UtilityService } from '../../../../core/services/utility.service';
import { removeSpaces } from '../../../../validators/custom.validator';

@Component({
  selector: 'app-crowdsource-list',
  templateUrl: './crowdsource-list.component.html',
  styleUrls: ['./crowdsource-list.component.scss']
})
export class CrowdsourceListComponent implements OnInit, OnChanges {

  @Input('tabDetails') tabDetails;
  @Input('viewStyle') viewStyle;
  currentTab: any;

  staticImage = {
    imageNotFoundUrl: this._const.STATIC_IMAGE.gallery_placeholder,
    playIcon: this._const.STATIC_IMAGE.play_icon,
    blobPlaceholder: this._const.STATIC_IMAGE.blob_placeholder_icon_white
  };

  isShowImagePopup = false;
  popupImageUrl = '';

  crowdsourcingFormGroup: FormGroup;
  sorting = this._sharedService.getSortingData('crowdsourceListing');
  filtering = this._sharedService.getFilteringData('crowdsourceListing');
  displayedColumns: string[] = ['thumbnailImgUrl', 'full_name', 'ugcUploadType', 'createdAt', 'title', 'vibesCount', 'commentsCount', 'reportsCount', 'actions'];
  dataSource = new MatTableDataSource([]);

  galleryTableData: any = [];
  urlCollections: any = [];
  noOfGridCols = _CONST.five; //default

  pageSizes = _CONST['defaultPageSizeArray'];
  pageSizeCount: number;
  actionMenu: Array<{}> = [
    { name: 'View Details', path: 'view', icon: 'remove_red_eye' },
    { name: 'Unpublish', path: 'unpublish', icon: 'unpublished' },
  ];

  filterBy: any = {
    userTypeOptions: [
      { name: 'all', value: 'all' },
      { name: 'UCS User', value: 'yes' },
      { name: 'Public User', value: 'no' }
    ],
    mediaTypeOptions: [
      { name: 'all', value: 'all' },
      { name: 'Image', value: 'image' },
      { name: 'Video', value: 'video' },
    ],
    searchOptions: [
      { name: 'User Name', value: 'full_name' },
      { name: 'Challenge', value: 'challenge_name' },
    ]
  };
  searchOptions: any = [];

  count = 0;
  currentPage = 0;
  nextPage: number;

  @ViewChild('searchTxtBox') searchTxtBox: ElementRef;
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private readonly _apollo: Apollo,
    private readonly _spinner: NgxSpinnerService,
    private readonly _const: AppConstantService,
    private readonly _errorHandler: CustomErrorHandlerService,
    private readonly _utilityService: UtilityService,
    private readonly _dialogsService: DialogsService,
    private readonly _toastr: ToastrService,
    private readonly _sharedService: SharedService,
    private readonly _router: Router
  ) {
    this.pageSizeCount = this.pageSizes[0];
  }

  @HostListener('window:keyup.esc') onKeyUp() {
    this.onDismissImagePopup();
  }

  ngOnInit(): void {
    this.currentTab = this.tabDetails?.tabs[this.tabDetails?.selectedTabIndex];
    this.crowdsourcingFormGroup = new FormGroup({
      'filterByUserType': new FormControl(this.filtering.userType, [Validators.required]),
      'filterByMediaType': new FormControl(this.filtering.mediaType, [Validators.required]),
      'searchBy': new FormControl(this.filtering.searchBy, [Validators.required]),
      'searchText': new FormControl(this.filtering.searchQuery, [Validators.required, removeSpaces])
    });

    this.fetchCrowdSourceGallery();
  }

  ngOnChanges() {
    this.onWindowResize();
  }

  ngAfterViewChecked(): void {
    // Access and use sort after view is checked
    if (this.sort) {
      // Perform sorting logic here
      this.sort.active = this.sorting.sortingByColumn;
      this.sort.direction = this.sorting.sortingOrders[this.sorting.currentOrder].toLowerCase();
    }
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.searchUserText();
  }

  /**
   * Paginator change event when next previous button click and size drop down change
   * @param e as PageEvent
   */
  public handlePage(e: PageEvent) {
    this.currentPage = e.pageIndex;
    this.pageSizeCount = e.pageSize;
    this.fetchCrowdSourceGallery();
  }

  // Fetch grid view or list view gallery data
  fetchCrowdSourceGallery() {
    this._spinner.show();
    this.dataSource = new MatTableDataSource([]);
    this._apollo
      .query({
        query: crowdSourceGalleryQuery,
        variables: {
          page: this.currentPage,
          limit: this.pageSizeCount,
          fetchVia: 'admin',
          adminViewType: this.currentTab?.type,
          userType: this.crowdsourcingFormGroup.value.filterByUserType,
          mediaType: this.crowdsourcingFormGroup.value.filterByMediaType,
          searchType: this.crowdsourcingFormGroup.value.searchBy,
          searchTerm: this.crowdsourcingFormGroup.value.searchText,
          orderBy: this.sorting.sortingByColumn,
          order: this.sorting.sortingOrders[this.sorting.currentOrder]
        },
        fetchPolicy: 'no-cache',
      }).subscribe(({ data }) => {
        this._spinner.hide();
        const dt = data['fetchAdminCrowdSourceGallery'];
        this.galleryTableData = dt?.gallery;
        this.count = dt?.count;
        this.dataSource = new MatTableDataSource(this.galleryTableData);
        this.extractUrlNamesFromTheList();
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }

  // Extract all the url name from the img / vid/ thumbnail_img url and make a collection i.e urlNames.
  extractUrlNamesFromTheList() {
    const urlNameArray = [];
    this.galleryTableData?.forEach(item => {
      if (item.ugcimageurl) {
        const imgUrl = this.extractUrlNameFromThePrivateUrl(item.ugcimageurl);
        urlNameArray.push(imgUrl);
      }

      if (item.ugcvideothumbnil) {
        const vidThumbnUrl = this.extractUrlNameFromThePrivateUrl(item.ugcvideothumbnil);
        urlNameArray.push(vidThumbnUrl);
      }

      if (item.ugcvideourl) {
        const vidUrl = this.extractUrlNameFromThePrivateUrl(item.ugcvideourl);
        urlNameArray.push(vidUrl);
      }
    });
    if (urlNameArray && urlNameArray.length > 0) {
      this.fetchActualUrlCollection(urlNameArray);
    } else {
      this.mapDataSource();
    }
  }

  // Extract the url names from the private url one by one.
  extractUrlNameFromThePrivateUrl(url: string) {
    let urlName, urlChunks;
    const regex = new RegExp('(Image|Video)\/.*');
    if (url) {
      urlChunks = url.match(regex);
    }
    if (urlChunks && urlChunks.length > 0) {
      urlName = urlChunks[0];
    }
    return urlName;
  }

  // Call API to fetch all actual urls by passing the private urls.
  fetchActualUrlCollection(urlNameArray: any) {
    this._apollo
      .query({
        query: fetchImageVideoUrlquery,
        variables: {
          names: urlNameArray
        },
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        this._spinner.hide();
        this.urlCollections = data['generateChallengeReadSAS'];
        this.mapDataSource();
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }

  mapDataSource() {
    this.galleryTableData = this.galleryTableData?.map(item => ({
      ...item,
      publicImageUrl: this.getActualUrl(item.ugcimageurl),
      publicVideoUrl: this.getActualUrl(item.ugcvideourl),
      thumbnailImgUrl: this.getThumnailImgUrl(item)

    }));

    this.dataSource = new MatTableDataSource(this.galleryTableData);
    this.dataSource.sort = this.sort;

  }

  getActualUrl(privateUrl) {
    const urlName = this.extractUrlNameFromThePrivateUrl(privateUrl);
    let urlObject;
    if (urlName && this.urlCollections && this.urlCollections.length > 0) {
      urlObject = this.urlCollections.find(item => item.name === urlName);
    }
    return urlObject ? urlObject.uri : '';
  }

  // Implementing custom sorting and fetch the sorted data though API.
  customSorting(sortingByColumn) {
    // when different -> existing and new column
    if (this.sorting.sortingByColumn !== sortingByColumn) {
      this.sorting.currentOrder = 1;
      this.sorting.sortingClickCounter = 0;
    }

    this.sorting.sortingClickCounter++;
    this.sorting.sortingByColumn = sortingByColumn;
    switch (this.sorting.sortingClickCounter) {
      //Ascending order
      case _CONST.one:
        this.sorting.currentOrder = 1;
        break;
      // Descending order
      case _CONST.two:
        this.sorting.currentOrder = 0;
        break;
      // Intial order i.e. descending
      case _CONST.three:
        this.sorting = { ...this._const.CROWDSOURCE_LIST_DEFAULT_SORTING };
        break;
      default:
        break;
    }
    this._sharedService.setSortingData('crowdsourceListing', this.sorting);
    this.fetchCrowdSourceGallery();
  }

  getThumnailImgUrl(data) {
    let thumbnailImgUrl;
    if (data && data.ugcUploadType && data.ugcUploadType.toLowerCase() === 'video') {
      thumbnailImgUrl = this.getActualUrl(data.ugcvideothumbnil);
    } else {
      if (data && data.ugcUploadType && data.ugcUploadType.toLowerCase() === 'image'){
        thumbnailImgUrl = this.getActualUrl(data.ugcimageurl);
      }
    }
    // No default action to perform

    return thumbnailImgUrl || this.staticImage.imageNotFoundUrl;
  }

  // This function is only to make sure the url does exist.
  getThumbnail(url) {
    return url ? url : this.staticImage.imageNotFoundUrl;
  }

  userAction(path: string, item: Object) {
    if (path === 'view') {
      this._sharedService.crowdsourceListActiveTabIndex = this.tabDetails?.selectedTabIndex;
      this._sharedService.crowdsourceListActiveViewStyle = this.viewStyle;
      this._router.navigateByUrl(`/crowdsource-gallery/gallery-details/${item['id']}`);
    } else{
      if (path === 'unpublish'){
        this.openUnpublishConfirmationDialog(item);
      }
      }
    // No default action to perform
  }

  openUnpublishConfirmationDialog(item) {
    const pgtitle = '';
    const message = this._const.UNPUBLISH_GALLERY_SUCCESS_MSG;
    const dialogType = 'confirm';
    this._dialogsService
      .confirmationDialogPopUp(pgtitle, message, dialogType)
      .subscribe(res => {
        if (res) {
          this.unpublishGallery(item);
        }
      });
  }

  unpublishGallery(item) {
    this._spinner.show();
    this._apollo.mutate({
      mutation: unpublishGalleryPostQuery,
      variables: {
        post_id: item.id,
        challenge_id: item.challenge_id,
        actionType: 'unpublish'
      }
    }).subscribe(({ data }) => {
      this._spinner.hide();
      this._toastr.success('The post has been successfully unpublished');
      this.fetchCrowdSourceGallery();
    }, error => {
      this._spinner.hide();
      this._errorHandler.manageError(error, true);
    });
  }

  openUrl(data) {
    if (data.ugcUploadType === 'Video') {
      this._dialogsService.videoPlayerDialog(data).subscribe();
    } else {
      if (data.publicImageUrl) {
        this.isShowImagePopup = true;
        this.popupImageUrl = data.publicImageUrl;
      }
    }
  }

  onDismissImagePopup() {
    this.isShowImagePopup = false;
    this.popupImageUrl = '';
  }

  /**
  * Reset search text on value change
  */
  getSearch() {
    if (this.crowdsourcingFormGroup.value.searchText !== '') {
      this.crowdsourcingFormGroup.value.searchText = '';
      this.searchTxtBox.nativeElement.value = '';
      this.fetchCrowdSourceGallery();
    }
  }

  /**
 * Set search by text when option change
 * @returns value as string
 */
  getSearchTxt() {
    switch (this.getFieldRef('searchBy').value) {
      case 'full_name':
        return 'User Name';
      case 'challenge_name':
        return 'Challenge';
      default:
        return '';
    }
  }

  /**
 * do search when user key in the text box
 */
  searchUserText() {
    const searchTerms = this._utilityService.searchData(this.searchTxtBox.nativeElement);
    searchTerms.subscribe(res => {
      if (res && res.length > 0) {
        this.crowdsourcingFormGroup.value.searchText = res;
        this.resetFilter();
      } else {
        this.resetFilter();
      }
    });
  }

  getFieldRef(field: string) {
    return this.crowdsourcingFormGroup.get(field);
  }

  resetFilter() {
    this.paginator.pageIndex = 0;
    this.currentPage = 0;
    this.filtering = {
      userType: this.crowdsourcingFormGroup.value.filterByUserType,
      mediaType:this.crowdsourcingFormGroup.value.filterByMediaType,
      searchBy: this.crowdsourcingFormGroup.value.searchBy,
      searchQuery: this.crowdsourcingFormGroup.value.searchText,
    };
    this._sharedService.setFilteringData('crowdsourceListing', this.filtering);
    this.fetchCrowdSourceGallery();
  }

  onWindowResize() {
    const winWidth = window.innerWidth;
    if (winWidth <= _CONST.MAX_SMALL_WIDTH) {
      this.noOfGridCols = 1;
    } else if (winWidth > _CONST.MAX_SMALL_WIDTH && winWidth <= _CONST.MEDIUM_WIDTH) {
      this.noOfGridCols = 2;
    } else if (winWidth > _CONST.MEDIUM_WIDTH && winWidth <= _CONST.MAX_MEDIUM_WIDTH) {
      this.noOfGridCols = 3;
    } else {
      this.noOfGridCols = 5;
    }
  }
}
