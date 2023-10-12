import { ChangeDetectorRef, Component, HostListener, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Apollo } from 'apollo-angular';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { _CONST } from '../../../../core/constants/app.constants';
import {
  fetchImageVideoUrlquery,
  getGalleryDetails,
  getReportedDataList,
  getVibesDataList,
  markThePostAsVisitedQuery,
  unpublishGalleryPostQuery
} from '../../../../core/query/crowdsourcing-gallery';
import { AppConstantService } from '../../../../core/services/app-constant.service';
import { CustomErrorHandlerService } from '../../../../core/services/custom-error-handler.service';
import { DialogsService } from '../../../../core/services/dialog-service';
import { SharedService } from '../../../../core/services/shared.service';
import { SocketIoService } from '../../../../core/services/socket-io.service';

@Component({
  selector: 'app-crowdsource-gallery-details',
  templateUrl: './crowdsource-gallery-details.component.html',
  styleUrls: ['./crowdsource-gallery-details.component.scss']
})
export class CrowdsourceGalleryDetailsComponent implements OnInit {

  vibeEmojiList: any;
  postId = 0;
  vibesId = 0;
  galleryData: any = [];
  isShowImagePopup = false;
  popupImageUrl = '';
  revisedGalleryData: any = {};
  imageNotFoundUrl = '../../../../assets/images/image-not-found.png';
  selectedTabIndex = 0;
  postTypes: string[] = ['reportsTab', 'vibesTab', 'commentsTab'];
  publicUrls: any;

  sorting: any;

  reportedTab = {
    displayedColumns: ['created_by_name', 'created_at', 'message'],
    columnMapping : {
      created_by:'created_by_name',
      created_at:'created_at',
      message:'message'
    },
    dataSource: new MatTableDataSource([]),
    reportedData: [],
    tabLabel: 'Reports',
    totalReportCount: 0
  };

  vibesTab: any = {
    displayedColumns: ['vibesUrl', 'full_name', 'created_at'],
    columnMapping : {
      vibes_id:'vibesUrl',
      full_name:'full_name',
      created_at:'created_at'
    },
    dataSource: new MatTableDataSource([]),
    tabLabel: 'Vibes',

    // Filter emoji
    vibesData: [],

    // table data
    vibesUserData: [],
    selectedTabIndex: 0,

    // Counts of all vibes
    totalVibesCount: 0
  };

  commentsTab: any = {
    tabLabel: 'Comments',
    totalCommentsCount: 0,
    socketResponse: {
      data: {},

      // add / update / delete
      eventType: ''
    },
  };

  // Socket Events.
  socketEvents: any = {
    onLatestUserVibe: this._const.WEB_SOCKET.CROWDSOURCE_LATEST_USER_VIBES_EVENT,
    onCommentAdded: this._const.WEB_SOCKET.CROWDSOURCE_ON_COMMENT_ADDED_EVENT,
    onCommentUpdated: this._const.WEB_SOCKET.CROWDSOURCE_ON_COMMENT_UPDATED_EVENT,
    onCommentDeleted: this._const.WEB_SOCKET.CROWDSOURCE_ON_COMMENT_DELETED_EVENT
  };

  pageSizes = _CONST['defaultPageSizeArray'];
  pageSizeCount: number;
  count = 0;
  currentPage = 0;
  nextPage: number;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private readonly _activateRouter: ActivatedRoute,
    private readonly _router: Router,
    private readonly _apollo: Apollo,
    private readonly _spinner: NgxSpinnerService,
    private readonly _sharedService: SharedService,
    private readonly _errorHandler: CustomErrorHandlerService,
    private readonly _dialogsService: DialogsService,
    private readonly cdref: ChangeDetectorRef,
    private readonly _socketService: SocketIoService,
    private readonly _const: AppConstantService,
    private readonly _toastr: ToastrService
  ) {
    this.pageSizeCount = this.pageSizes[0];
  }

  ngOnInit(): void {
    this.initSorting();
    this.vibeEmojiList = this._const.VIBE_EMOJI_LIST;
    this._activateRouter.params.subscribe(param => {
      this.postId = parseFloat(param?.id);
    });
    this.fetchCrowdSourceGalleryDetails();
    this.markThePostAsVisited();
    this.fetchReportsTabList();
    this.callSocketEvent();
  }

  ngAfterContentChecked() {
    this.cdref.detectChanges();
  }

  initTabInitialData() {
    this.pageSizes = _CONST['defaultPageSizeArray'];
    this.pageSizeCount = this.pageSizes[0];
    this.count = 0;
    this.currentPage = 0;
  }

  @HostListener('window:keyup.esc') onKeyUp() {
    this.onDismissImagePopup();
  }

  /**
   * Paginator change event when next previous button click and size drop down change
   * @param e as PageEvent
   */
  public handlePage(e: PageEvent) {
    this.currentPage = e.pageIndex;
    this.pageSizeCount = e.pageSize;
    this.fetchReportsTabList();
  }

  initSorting() {
    this.sorting = {
      // Reported Tab
      0: this._sharedService.getSortingData('galleryDetailReportedTabListing'),

      // vibes Tab
      1: this._sharedService.getSortingData('galleryDetailVibesTabListing'),

      // comments Tab
      2: ''
    };
  }
  callSocketEvent() {
    this.onLatestVibeUpdate();
    this.onNewCommentAdded();
    this.onExistingCommentUpdated();
    this.onCommentDeleted();
  }

  // Get a new comment via socket.
  onNewCommentAdded() {
    this._socketService.listen(this.socketEvents.onCommentAdded).subscribe((data: any) => {
      if (data.post_id === this.postId) {
        this.commentsTab.totalCommentsCount += 1;
        this.commentsTab.socketResponse = { data, eventType: 'add', updatedCount: this.commentsTab.totalCommentsCount };
      }
    });
  }

  // Get an updated comment via socket.
  onExistingCommentUpdated() {
    this._socketService.listen(this.socketEvents.onCommentUpdated).subscribe((data: any) => {
      if (data.post_id === this.postId) {
        this.commentsTab.socketResponse = { data, eventType: 'update', updatedCount: this.commentsTab.totalCommentsCount };
      }
    });
  }

  // Get a deleted comment information via socket.
  onCommentDeleted() {
    this._socketService.listen(this.socketEvents.onCommentDeleted).subscribe((data: any) => {
      if (data.post_id === this.postId) {
        this.commentsTab.totalCommentsCount -= 1;
        this.commentsTab.socketResponse = { data, eventType: 'delete', updatedCount: this.commentsTab.totalCommentsCount };
      }
    });
  }

  // Get latest vibe update via socket.
  onLatestVibeUpdate() {
    this._socketService.listen(this.socketEvents.onLatestUserVibe).subscribe((data: any) => {
      this.manageLatestVibes(data);
    });
  }

  // Manage vibes when received a new update via socket.
  manageLatestVibes(newUserVibes) {
    if (newUserVibes.post_id === this.postId) {
      this.vibesTab.totalVibesCount = newUserVibes.count;

      // When a new vibe is about to add
      if (newUserVibes.status === 1) {
        this.addAnewVibe(newUserVibes);
      }else {
        // when an existing vibe is about to delete
        this.deleteAnExistingVibe(newUserVibes);
      }
      this.setVibePaginationCount();
    }
  }

  // Add a new vibe emoji when received via socket event.
  addAnewVibe(newUserVibes) {
    this.vibesTab.vibesData = [...this.vibesTab.vibesData];
    const foundIndex = this.vibesTab.vibesData.findIndex(item => item.vibes_id === newUserVibes.vibes?.id);
    let currentVibeCount = this.vibesTab.vibesData[foundIndex]?.count || 0;
    ++currentVibeCount;

    // Updating an existing vibe_id
    if (foundIndex >= 0) {
      this.updateAnExitingVibe(newUserVibes, currentVibeCount);
    }else {
      // Appending a vibe with a new  vibe_id
      this.appendAnewVibe(newUserVibes, currentVibeCount);
    }

    this.addLatestVibeUser(newUserVibes);
  }

  // Add the vibe user only when the vibe id is of current vibe tab.
  addLatestVibeUser(newUserVibes) {
    if (this.vibesId === 0 || this.vibesId === newUserVibes.vibes?.id) {
      this.vibesTab.vibesUserData = [...this.vibesTab.vibesUserData];
      this.vibesTab.vibesUserData.unshift({
        created_by: newUserVibes.by_user?.user_id,
        full_name: `${newUserVibes.by_user?.first_name} ${newUserVibes.by_user?.last_name}`,
        created_at: newUserVibes.by_user?.sendDate,
        vibes_id: newUserVibes.vibes?.id
      });
      this.vibesTab.dataSource = new MatTableDataSource(this.vibesTab.vibesUserData);
    }
  }

  // Delete an existing vibe emoji when received via socket event.
  deleteAnExistingVibe(newUserVibes) {
    const foundIndex = this.vibesTab.vibesData.findIndex(item => item.vibes_id === newUserVibes.vibes?.id);
    let currentVibeCount = this.vibesTab.vibesData[foundIndex]?.count || 0;
    --currentVibeCount;

    // If current vibe count is already 0 then simply remove that vibe object in case of vibe delete
    if (currentVibeCount === 0) {
      this.vibesTab.vibesData = [...this.vibesTab.vibesData];
      this.vibesTab.vibesData.splice(foundIndex, 1);
    }else {
      // Updating an existing vibe_id
      this.updateAnExitingVibe(newUserVibes, currentVibeCount);
    }

    this.deleteAnExitingVibeUser(newUserVibes);
  }

  deleteAnExitingVibeUser(newUserVibes) {
    if (this.vibesId === 0 || this.vibesId === newUserVibes.vibes?.id) {
      this.vibesTab.vibesUserData = [...this.vibesTab.vibesUserData];
      let foundIndex;
      if (this.vibesTab.vibesUserData && this.vibesTab.vibesUserData.length > 0) {
        foundIndex = this.vibesTab.vibesUserData.findIndex(item => item.created_by === newUserVibes.by_user?.user_id);
      }

      // Check to Delete the user only when at least one user exist on the table list and.
      // And user can delete its own vibe only.
      if (foundIndex >= 0 && this.vibesTab.vibesUserData[foundIndex].created_by === newUserVibes.by_user?.user_id) {
        this.vibesTab.vibesUserData.splice(foundIndex, 1);
      }
      this.vibesTab.dataSource = new MatTableDataSource(this.vibesTab.vibesUserData);
    }
  }

  updateAnExitingVibe(vibeObj, updatedVibeCount) {
    this.vibesTab.vibesData = this.vibesTab.vibesData.map(item => ({
      ...item,
      count: item.vibes_id === vibeObj.vibes?.id ? updatedVibeCount : item.count,
      vibes_id: item.vibes_id,
      url: vibeObj.vibes?.url
    }));
  }

  appendAnewVibe(vibeObj, updatedVibeCount) {
    this.vibesTab.vibesData = [...this.vibesTab.vibesData];
    this.vibesTab.vibesData.push({
      count: updatedVibeCount,
      vibes_id: vibeObj.vibes?.id,
      url: vibeObj.vibes?.url
    });
  }

  // Gallery i.e. image/video detail on the top of page
  fetchCrowdSourceGalleryDetails() {
    this._spinner.show();
    this._apollo
      .query({
        query: getGalleryDetails,
        variables: {
          page: 0,
          limit: 1,
          postDetailType: 'postdetails',
          post_id: this.postId
        },
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        this._spinner.hide();
        const dt = data['getGalleryDetails'];
        this.galleryData = dt['gallerData'];
        this.extractUrlNames(this.galleryData[0]);
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }

  // Reports tab list data
  fetchReportsTabList() {
    this.reportedTab.dataSource = new MatTableDataSource([]);
    this._spinner.show();
    this._apollo
      .query({
        query: getReportedDataList,
        variables: {
          limit: this.pageSizeCount,
          page: this.currentPage,
          postDetailType: 'reported',
          post_id: this.postId,
          orderBy: this.sorting[this.selectedTabIndex].sortingByColumn,
          order: this.sorting[this.selectedTabIndex].sortingOrders[this.sorting[this.selectedTabIndex].currentOrder]
        },
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        this._spinner.hide();
        const dt = data['getGalleryDetails'];
        const reportResponse = dt['postReport'];
        this.reportedTab.reportedData = reportResponse?.data;
        this.reportedTab.reportedData = this.getRevisedDatasource(reportResponse?.users);
        this.reportedTab.dataSource = new MatTableDataSource(this.reportedTab.reportedData);
        this.sort.active = this.reportedTab.columnMapping[this.sorting[this.selectedTabIndex].sortingByColumn];
        this.sort.direction = this.sorting[this.selectedTabIndex].sortingOrders[this.sorting[this.selectedTabIndex].currentOrder].toLowerCase();
        this.count = reportResponse?.count;
        this.reportedTab.totalReportCount = this.count;
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }

  getRevisedDatasource(userData) {
    return this.reportedTab.reportedData.map(item => ({
      ...item,
      created_by_name: this.getReportedByName(userData, item.created_by)
    }));
  }

  getReportedByName(userData, userId) {
    const res = userData.find(element => element.user_id === userId);
    return res ? res['full_name'] : '';
  }


  // Vibe tab list data
  fetchVibesTabList() {
    this.vibesTab.dataSource = new MatTableDataSource([]);
    this._spinner.show();
    this._apollo
      .query({
        query: getVibesDataList,
        variables: {
          page: 0,
          limit: 10,
          postDetailType: 'vibes',
          post_id: this.postId,
          vibe_id: this.vibesId,
          orderBy: this.sorting[this.selectedTabIndex].sortingByColumn,
          order: this.sorting[this.selectedTabIndex].sortingOrders[this.sorting[this.selectedTabIndex].currentOrder]
        },
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        this._spinner.hide();
        const dt = data['getGalleryDetails'];
        this.vibesTab.vibesData = dt['vibes']?.data;
        this.vibesTab.vibesUserData = dt['vibes']?.users;
        this.vibesTab.dataSource = new MatTableDataSource(this.vibesTab.vibesUserData);
        this.vibesTab.totalVibesCount = dt['vibes']?.count;
        this.setVibePaginationCount();
        this.sort.active = this.vibesTab.columnMapping[this.sorting[this.selectedTabIndex].sortingByColumn];
        this.sort.direction = this.sorting[this.selectedTabIndex].sortingOrders[this.sorting[this.selectedTabIndex].currentOrder].toLowerCase();
        this.vibesTab.dataSource.sort = this.sort;
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
  }

  // Call API to fetch all actual urls by passing the private urls.
  fetchPublicUrls(urlNameArray: any) {
    this._apollo
      .query({
        query: fetchImageVideoUrlquery,
        variables: {
          names: urlNameArray
        },
        fetchPolicy: 'no-cache'
      }).subscribe(({ data }) => {
        if (!this.publicUrls) {
          this.publicUrls = data['generateChallengeReadSAS'];
          this.publicMediaUrls();
        }
      }, error => {
        this._spinner.hide();
        this._errorHandler.manageError(error, true);
      });
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

  // Extract the url name from the img / vid/ thumbnail_img url and make a collection i.e urlNames.
  extractUrlNames(data) {
    const urlNameArray = [];
    if (data && data.ugcimageurl) {
      const imgUrl = this.extractUrlNameFromThePrivateUrl(data.ugcimageurl);
      urlNameArray.push(imgUrl);
    } else {
      if (data && data.ugcvideothumbnil) {
        const vidThumbnUrl = this.extractUrlNameFromThePrivateUrl(data.ugcvideothumbnil);
        urlNameArray.push(vidThumbnUrl);
      }

      if (data && data.ugcvideourl) {
        const vidUrl = this.extractUrlNameFromThePrivateUrl(data.ugcvideourl);
        urlNameArray.push(vidUrl);
      }
    }

    if (urlNameArray && urlNameArray.length > 0) {
      this.fetchPublicUrls(urlNameArray);
    } else {
      this.publicMediaUrls();
    }
  }

  publicMediaUrls() {
    this.galleryData = this.galleryData.map(item => ({
      ...item,
      publicImageUrl: this.extractPublicUrl(item.ugcimageurl),
      publicVideoUrl: this.extractPublicUrl(item.ugcvideourl),
      thumbnailImgUrl: this.getThumbnailImgUrl(item)
    }));
    this.revisedGalleryData = this.galleryData[0];
    this.vibesTab.totalVibesCount = this.revisedGalleryData?.vibesCount;
    this.commentsTab.totalCommentsCount = this.revisedGalleryData?.commentsCount;
  }

  getThumbnailImgUrl(data) {
    let thumbnailImgUrl;
    if (data.ugcUploadType && data.ugcUploadType.toLowerCase() === 'video') {
      thumbnailImgUrl = this.extractPublicUrl(data.ugcvideothumbnil);
    } else {
      if (data.ugcUploadType && data.ugcUploadType.toLowerCase() === 'image'){
        thumbnailImgUrl = this.extractPublicUrl(data.ugcimageurl);
      }
    }
    return thumbnailImgUrl || this.imageNotFoundUrl;
  }

  extractPublicUrl(privateUrl) {
    const urlName = this.extractUrlNameFromThePrivateUrl(privateUrl);
    let urlObject;
    if (urlName && this.publicUrls && this.publicUrls.length > 0) {
      urlObject = this.publicUrls.find(item => item.name === urlName);
    }

    // Actual Url
    return urlObject ? urlObject.uri : '';
  }

  setVibePaginationCount() {
    if (this.vibesId === 0) {
      this.count = this.vibesTab.totalVibesCount;
    } else {
      const foundVibe = this.vibesTab.vibesData.find(item => item.vibes_id === this.vibesId);
      this.count = foundVibe?.count || 0;
    }
  }

  getVibeEmoji(vibeId) {
    // Returns vibe with above vibeId.
    return this.vibeEmojiList.find(item => parseInt(item.vibes_id) === parseInt(vibeId));
  }

  goBack() {
    this._router.navigateByUrl('/crowdsource-gallery');
  }

  openUrl(data) {
    if (data?.ugcUploadType === 'Video') {
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

  onTabChanged() {
    this.initSorting();
    this.initTabInitialData();
    switch (this.selectedTabIndex) {
      // Reports Tab
      case _CONST.zero:
        this.fetchReportsTabList();
        break;

      // Vibes tab
      case _CONST.one:
        this.fetchVibesTabList();
        break;

      // Comment Tab
      case _CONST.two:
        break;
      default:
        break;
    }
  }

  galleryUnpublish() {
    this._spinner.show();
    this._apollo.mutate({
      mutation: unpublishGalleryPostQuery,
      variables: {
        post_id: this.postId,
        challenge_id: this.revisedGalleryData?.challenge_id,
        actionType: 'unpublish'
      }
    }).subscribe(({ data }) => {
      this._spinner.hide();
      this._toastr.success('The post has been successfully unpublished');
      this.goBack();
    }, error => {
      this._spinner.hide();
      this._errorHandler.manageError(error, true);
    });
  }

  onVibeSubTabChanged(vibesId, selectedTabIndex) {
    // When tab is changed i.e, new and current tab's vibe id are diffenrent
    if (this.vibesId !== vibesId) {
      this.vibesId = vibesId;
      this.vibesTab.selectedTabIndex = selectedTabIndex;
      this.fetchVibesTabList();
    }
  }

  // Implementing custom sorting and fetch the sorted data though API.
  customSorting(sortingByColumn) {
    // when different -> existing and new column
    if (this.sorting[this.selectedTabIndex].sortingByColumn !== sortingByColumn) {
      this.sorting[this.selectedTabIndex].currentOrder = 1;
      this.sorting[this.selectedTabIndex].sortingClickCounter = 0;
    }

    this.sorting[this.selectedTabIndex].sortingClickCounter++;
    this.sorting[this.selectedTabIndex].sortingByColumn = sortingByColumn;
    // Define a constant for ascending order
    const ASCENDING_ORDER = 1;
    // Define a constant for descending order
    const DESCENDING_ORDER = 2;
     // Define a constant for default order
     const DEFAULT_ORDER = 3;
    switch (this.sorting[this.selectedTabIndex].sortingClickCounter) {

      //Ascending order
      case ASCENDING_ORDER:
        this.sorting[this.selectedTabIndex].currentOrder = 1;
        break;

      // Descending order
      case DESCENDING_ORDER:
        this.sorting[this.selectedTabIndex].currentOrder = 0;
        break;

      // Initial order i.e. descending
      case DEFAULT_ORDER:
        this.sorting[this.selectedTabIndex] = { ...this._const.CROWDSOURCE_DETAIL_REPORTED_TAB_DEFAULT_SORTING };
        break;
      default:
        break;
    }
    this._sharedService.setSortingData('adminUserListing', this.sorting[this.selectedTabIndex]);
    if(this.selectedTabIndex === 0 ){
      this._sharedService.setSortingData('galleryDetailReportedTabListing', this.sorting[this.selectedTabIndex]);
    }else{
      this._sharedService.setSortingData('galleryDetailVibesTabListing', this.sorting[this.selectedTabIndex]);
    }
    this.fetchListData();
  }

  fetchListData() {
    switch (this.selectedTabIndex) {
      // Reports Tab
      case 0:
        this.fetchReportsTabList();
        break;

      // Vibes Tab
      case 1:
        this.fetchVibesTabList();
        break;
      default:
        break;
    }
  }

  openUnpublishConfirmationPopup() {
    const pgtitle = '';
    const message = this._const.UNPUBLISH_GALLERY_SUCCESS_MSG;
    const dialogType = 'confirm';
    this._dialogsService
      .confirmationDialogPopUp(pgtitle, message, dialogType)
      .subscribe(res => {
        if (res) {
          this.galleryUnpublish();
        }
      });
  }

  updateLatestCommentCount(counts) {
    this.commentsTab.totalCommentsCount = counts;
  }

  markThePostAsVisited() {
    this._spinner.show();
    this._apollo.mutate({
      mutation: markThePostAsVisitedQuery,
      variables: {
        id: this.postId
      }
    }).subscribe(({ data }) => {
      this._spinner.hide();
    }, error => {
      this._spinner.hide();
      this._errorHandler.manageError(error, true);
    });
  }
}
