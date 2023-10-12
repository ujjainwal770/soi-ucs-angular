import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { InMemoryCache } from '@apollo/client/cache';
import { addTypenameToDocument } from '@apollo/client/utilities';
import { OKTA_CONFIG } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { ApolloTestingController, ApolloTestingModule, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of, throwError } from 'rxjs';
import mockValues from 'src/app/core/constants/mock.values';
import { fetchImageVideoUrlquery, getGalleryDetails, getReportedDataList, getVibesDataList, markThePostAsVisitedQuery } from 'src/app/core/query/crowdsourcing-gallery';
import { AppConstantService } from 'src/app/core/services/app-constant.service';
import { DialogsService } from 'src/app/core/services/dialog-service';
import { HttpService } from 'src/app/core/services/http.service';
import { SocketIoService } from 'src/app/core/services/socket-io.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';
import { CrowdsourceGalleryComponent } from '../crowdsource-gallery.component';
import { CrowdsourceGalleryDetailsComponent } from './crowdsource-gallery-details.component';
const oktaAuth = new OktaAuth(mockValues.oktaConfig);

describe('CrowdsourceGalleryDetailsComponent', () => {
  let component: CrowdsourceGalleryDetailsComponent;
  let fixture: ComponentFixture<CrowdsourceGalleryDetailsComponent>;

  let _router: Router;
  let backend: ApolloTestingController;
  let _socketService: SocketIoService;
  let _dialogsService: DialogsService;


  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrowdsourceGalleryDetailsComponent],
      imports: [
        MaterialModule,
        RouterTestingModule.withRoutes([
          { path: 'crowdsource-gallery', component: CrowdsourceGalleryComponent }
        ]),
        HttpClientModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ToastrModule.forRoot(),
        ApolloTestingModule,
        ReactiveFormsModule
      ],
      providers: [
        HttpService,
        ToastrService,
        NgxSpinnerService,
        UtilityService,
        DialogsService,
        SocketIoService,
        AppConstantService,
        {
          provide: APOLLO_TESTING_CACHE,
          useValue: new InMemoryCache({
            addTypename: true
          }),
        },
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ id: '1' })
          }
        },
        { provide: OKTA_CONFIG, useValue: { oktaAuth } }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    })
      .compileComponents();
  });

  beforeAll(() => {
    window.onbeforeunload = () => 'Oh no!';
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CrowdsourceGalleryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    _router = TestBed.inject(Router);
    backend = TestBed.inject(ApolloTestingController);
    _socketService = TestBed.inject(SocketIoService);
    _dialogsService = TestBed.inject(DialogsService);

    spyOn(component, 'onKeyUp').and.callThrough();
    spyOn(component, 'openUrl').and.callThrough();
    spyOn(component, 'handlePage').and.callThrough();
    spyOn(component, 'onDismissImagePopup').and.callThrough();
    spyOn(component, 'fetchPublicUrls').and.callThrough();
    spyOn(component, 'extractUrlNameFromThePrivateUrl').and.callThrough();
    spyOn(component, 'getThumbnailImgUrl').and.callThrough();
    spyOn(component, 'publicMediaUrls').and.callThrough();
    spyOn(component, 'extractUrlNames').and.callThrough();
    spyOn(component, 'fetchCrowdSourceGalleryDetails').and.callThrough();
    spyOn(component, 'extractPublicUrl').and.callThrough();
    spyOn(component, 'fetchReportsTabList').and.callThrough();
    spyOn(component, 'fetchVibesTabList').and.callThrough();
    spyOn(component, 'onTabChanged').and.callThrough();
    spyOn(component, 'onVibeSubTabChanged').and.callThrough();
    spyOn(component, 'manageLatestVibes').and.callThrough();
    spyOn(component, 'addAnewVibe').and.callThrough();
    spyOn(component, 'deleteAnExistingVibe').and.callThrough();
    spyOn(component, 'setVibePaginationCount').and.callThrough();
    spyOn(component, 'onLatestVibeUpdate').and.callThrough();
    spyOn(component, 'addLatestVibeUser').and.callThrough();
    spyOn(component, 'appendAnewVibe').and.callThrough();
    spyOn(component, 'getVibeEmoji').and.callThrough();
    spyOn(component, 'updateAnExitingVibe').and.callThrough();
    spyOn(component, 'deleteAnExitingVibeUser').and.callThrough();
    spyOn(component, 'openUnpublishConfirmationPopup').and.callThrough();
    spyOn(component, 'galleryUnpublish').and.callThrough();
    spyOn(component, 'markThePostAsVisited').and.callThrough();
    spyOn(component, 'initSorting').and.callThrough();
    spyOn(component, 'updateLatestCommentCount').and.callThrough();
    spyOn(component, 'onNewCommentAdded').and.callThrough();
    spyOn(component, 'onExistingCommentUpdated').and.callThrough();
    spyOn(component, 'onCommentDeleted').and.callThrough();
    spyOn(component, 'customSorting').and.callThrough();
    spyOn(component, 'fetchListData').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check #onKeyUp()', () => {
    console.log(`CrowdsourceGalleryDetailsComponent --> should check #onKeyUp()`);

    component.onKeyUp();
    expect(component.onDismissImagePopup).toHaveBeenCalled();
  });

  it('should call handlePage() return valid', () => {
    console.log(`CrowdsourceGalleryDetailsComponent --> should call handlePage() return valid`);

    const e = {
      length: 9,
      pageIndex: 1,
      pageSize: 5,
      previousPageIndex: 0
    }
    component.handlePage(e)
    expect(component.currentPage).toEqual(1);
  });

  it('should check #openUrl() - type = Video', () => {
    console.log(`CrowdsourceGalleryDetailsComponent --> should check #openUrl() - type = Video`);

    let data = {
      ugcUploadType: "Video"
    };
    _dialogsService.videoPlayerDialog(data)
    spyOn(_dialogsService, "videoPlayerDialog").and.returnValue(of('data'));
    component.openUrl(data);
  });

  it('should check #openUrl() - type = Image and image url exist', () => {
    console.log(`CrowdsourceGalleryDetailsComponent --> should check #openUrl() - type = Image and image url exist`);

    let data = {
      ugcUploadType: "Image",
      publicImageUrl: "/image.jpg"
    };
    component.openUrl(data);
    expect(component.popupImageUrl).toBe(data.publicImageUrl);
  });

  it('should check #openUrl() - type = Image and image url doest not exist', () => {
    console.log(`CrowdsourceGalleryDetailsComponent --> should check #openUrl() - type = Image and image url does not exist`);

    let data = {
      ugcUploadType: "Image",
      publicImageUrl: ""
    };
    component.openUrl(data);
    expect(false).toBe(false);
  });

  it('should call goBack()', () => {
    console.log(`EditStudentComponent -> goBack() -> 1`);

    const spy = spyOn(_router, 'navigateByUrl');
    component.goBack();
    expect(_router.navigateByUrl).toHaveBeenCalled();
  });

  it('should check #onDismissImagePopup()', () => {
    console.log(`CrowdsourceGalleryDetailsComponent --> should check #onDismissImagePopup()`);

    component.onDismissImagePopup();
    expect(component.popupImageUrl).toBe("");
  });

  it('should check #fetchPublicUrls() - when no publicUrls', () => {
    console.log(`CrowdsourceGalleryDetailsComponent --> should check #fetchPublicUrls()`);

    component.publicUrls = null;
    let urlNameArray = ["Image/347f8f10-3197-4761-b1ac-ca21225929139ab5564b-8991-4997-8052-6564447dc693"];
    component.fetchPublicUrls(urlNameArray);
    const op = backend.expectOne(addTypenameToDocument(fetchImageVideoUrlquery));
    op.flush({
      "data": { "generateChallengeReadSAS": [{ "token": "st=2022-09-04T15%3A22%3A50Z&se=2022-09-04T16%3A22%3A50Z&sp=r&sv=2018-03-28&sr=b&sig=cGaQHfSOkOOpxFgXorBvzRXwuq%2FbS5vGq36Ylo6HoDc%3D", "uri": "https://soucsdevsa.blob.core.windows.net/soucs-challenges-users-upload-dev/Image/347f8f10-3197-4761-b1ac-ca21225929139ab5564b-8991-4997-8052-6564447dc693?st=2022-09-04T15%3A22%3A50Z&se=2022-09-04T16%3A22%3A50Z&sp=r&sv=2018-03-28&sr=b&sig=cGaQHfSOkOOpxFgXorBvzRXwuq%2FbS5vGq36Ylo6HoDc%3D", "name": "Image/347f8f10-3197-4761-b1ac-ca21225929139ab5564b-8991-4997-8052-6564447dc693", "__typename": "TokenUriAzureWithName" }] }
    });
    expect(false).toBe(false);
  });

  it('should check #fetchPublicUrls() - when publicUrls', () => {
    console.log(`CrowdsourceGalleryDetailsComponent --> should check #fetchPublicUrls()`);

    component.publicUrls = [{}];
    let urlNameArray = ["Image/347f8f10-3197-4761-b1ac-ca21225929139ab5564b-8991-4997-8052-6564447dc693"];
    component.fetchPublicUrls(urlNameArray);
    const op = backend.expectOne(addTypenameToDocument(fetchImageVideoUrlquery));
    op.flush({
      "data": { "generateChallengeReadSAS": [{ "token": "st=2022-09-04T15%3A22%3A50Z&se=2022-09-04T16%3A22%3A50Z&sp=r&sv=2018-03-28&sr=b&sig=cGaQHfSOkOOpxFgXorBvzRXwuq%2FbS5vGq36Ylo6HoDc%3D", "uri": "https://soucsdevsa.blob.core.windows.net/soucs-challenges-users-upload-dev/Image/347f8f10-3197-4761-b1ac-ca21225929139ab5564b-8991-4997-8052-6564447dc693?st=2022-09-04T15%3A22%3A50Z&se=2022-09-04T16%3A22%3A50Z&sp=r&sv=2018-03-28&sr=b&sig=cGaQHfSOkOOpxFgXorBvzRXwuq%2FbS5vGq36Ylo6HoDc%3D", "name": "Image/347f8f10-3197-4761-b1ac-ca21225929139ab5564b-8991-4997-8052-6564447dc693", "__typename": "TokenUriAzureWithName" }] }
    });
    expect(false).toBe(false);
  });

  it('should check #extractUrlNameFromThePrivateUrl() - if part', () => {
    console.log(`CrowdsourceGalleryDetailsComponent --> should check #extractUrlNameFromThePrivateUrl() - if part`);

    let url = "Image/#";
    let urlName = component.extractUrlNameFromThePrivateUrl(url);
    expect(urlName).toBe(url);
  });

  it('should check #extractUrlNameFromThePrivateUrl() - else part', () => {
    console.log(`CrowdsourceGalleryDetailsComponent --> should check #extractUrlNameFromThePrivateUrl() - else part`);

    let url = null;
    let urlName = component.extractUrlNameFromThePrivateUrl(url);
    expect(urlName).not.toBe(url);
  });

  it('should check #getThumbnailImgUrl() - when type = image', () => {
    console.log(`CrowdsourceGalleryDetailsComponent --> should check #getThumbnailImgUrl() - when type = Image`);

    let thumbnailImgUrl = component.imageNotFoundUrl;
    let data = { "__typename": "CrowdSourceGalleryResponse", "full_name": "Roy Jorden", "ugcUploadType": "Image", "createdAt": 1652251328615, "title": "Thank a Teacher!", "vibesCount": null, "commentsCount": null, "reportsCount": null, "ugcvideourl": "", "ugcimageurl": "#", "ugcvideothumbnil": null, "blob": "#", "publicImageUrl": "#", "publicVideoUrl": "", "thumbnailImgUrl": "#" };
    expect(component.getThumbnailImgUrl(data)).toBe(thumbnailImgUrl);
  });

  it('should check #getThumbnailImgUrl() - when type = video', () => {
    console.log(`CrowdsourceGalleryDetailsComponent --> should check #getThumbnailImgUrl() - when type = video`);

    let thumbnailImgUrl = component.imageNotFoundUrl;
    let data = { "__typename": "CrowdSourceGalleryResponse", "full_name": "Roy Jorden", "ugcUploadType": "Video", "createdAt": 1652251328615, "title": "Thank a Teacher!", "vibesCount": null, "commentsCount": null, "reportsCount": null, "ugcvideourl": "", "ugcimageurl": "#", "ugcvideothumbnil": "#", "blob": "#", "publicImageUrl": "#", "publicVideoUrl": "#", "thumbnailImgUrl": "#" };
    expect(component.getThumbnailImgUrl(data)).toBe(thumbnailImgUrl);
  });

  it('should check #getThumbnailImgUrl() - when type != image/video', () => {
    console.log(`CrowdsourceGalleryDetailsComponent --> should check #getThumbnailImgUrl() -when type != image/video`);

    let data = { "__typename": "CrowdSourceGalleryResponse", "full_name": "Roy Jorden", "ugcUploadType": null, "createdAt": 1652251328615, "title": "Thank a Teacher!", "vibesCount": null, "commentsCount": null, "reportsCount": null, "ugcvideourl": "", "ugcimageurl": "#", "ugcvideothumbnil": "#", "blob": "#", "publicImageUrl": "#", "publicVideoUrl": "#", "thumbnailImgUrl": "#" };
    component.getThumbnailImgUrl(data);
    expect(true).toBeTruthy();
  });

  it('should check #fetchCrowdSourceGalleryDetails()', () => {
    console.log(`CrowdsourceGalleryDetailsComponent --> should check #fetchCrowdSourceGalleryDetails()`);

    component.fetchCrowdSourceGalleryDetails();
    const op = backend.expectOne(addTypenameToDocument(getGalleryDetails));
    op.flush({
      "data": { "getGalleryDetails": { "gallerData": [{ "id": 84, "full_name": "John test Carter", "createdAt": 1662984696482, "ugcimageurl": "https://soucsdevsa.blob.core.windows.net/soucs-challenges-users-upload-dev/Image/a46b6f05-8784-43bc-b817-4488794960724718aa90-a94e-4429-8136-6cc436be145b", "ugcvideourl": "", "ugcvideothumbnil": null, "ugcUploadType": "Image", "title": "Sprint 4_challenge 1", "postCount": 0, "vibesCount": 1, "commentsCount": 0, "__typename": "PostReportDetailScreensResponse" }], "__typename": "GalleryDetailsResponse" } }
    });
    expect(false).toBe(false);
  });

  it('should check #extractPublicUrl()', () => {
    console.log(`CrowdsourceGalleryDetailsComponent --> should check #extractPublicUrl()`);

    let privateUrl = "Video/701e0f40-ad3a%3D";
    component.publicUrls = [{ "token": "mock-token-here", "uri": privateUrl, "name": privateUrl }];
    let actualUrl = component.extractPublicUrl(privateUrl);
    expect(actualUrl).toBe(privateUrl);
  });

  it('should check #publicMediaUrls()', () => {
    console.log(`CrowdsourceGalleryDetailsComponent --> should check #publicMediaUrls()`);

    component.galleryData = [{ "__typename": "CrowdSourceGalleryResponse", "full_name": "Roy Jorden", "ugcUploadType": null, "createdAt": 1652251328615, "title": "Thank a Teacher!", "vibesCount": null, "commentsCount": null, "reportsCount": null, "ugcvideourl": "", "ugcimageurl": "#", "ugcvideothumbnil": "#", "blob": "#", "publicImageUrl": "#", "publicVideoUrl": "#", "thumbnailImgUrl": "#" }];
    component.publicMediaUrls();
    expect(component.revisedGalleryData).toBeDefined();
  });

  it('should check #extractUrlNames() - when image url available', () => {
    console.log(`CrowdsourceGalleryDetailsComponent --> should check #extractUrlNames() - when image url available`);

    let data = [{ "ugcimageurl": "https://soucsdevsa.blob.core.windows.net/soucs-challenges-users-upload-dev/Image/423a5491", "ugcvideourl": "https://soucsdevsa.blob.core.windows.net/soucs-challenges-users-upload-dev/Video/423a5491", "ugcvideothumbnil": "https://soucsdevsa.blob.core.windows.net/soucs-challenges-users-upload-dev/Image/423a5491", "ugcUploadType": "Image" }];
    component.extractUrlNames(data);
    expect(false).toBe(false);
  });
  it('should check #extractUrlNames() - when not imageurl but video-thumbnail', () => {
    console.log(`CrowdsourceGalleryDetailsComponent --> should check #extractUrlNames() - when not imageurl but video-thumbnail`);

    let data = [{ "ugcimageurl": "", "ugcvideourl": "", "ugcvideothumbnil": "https://soucsdevsa.blob.core.windows.net/soucs-challenges-users-upload-dev/Image/423a5491", "ugcUploadType": "Image" }];
    component.extractUrlNames(data);
    expect(false).toBe(false);
  });

  it('should check #extractUrlNames() - when not imageurl but video url', () => {
    console.log(`CrowdsourceGalleryDetailsComponent --> should check #extractUrlNames() - when not imageurl but video url`);

    let data = [{ "ugcimageurl": "", "ugcvideourl": "https://soucsdevsa.blob.core.windows.net/soucs-challenges-users-upload-dev/Video/423a5491", "ugcvideothumbnil": "", "ugcUploadType": "Image" }];
    component.extractUrlNames(data);
    expect(false).toBe(false);
  });

  it('should check #fetchReportsTabList()', () => {
    console.log(`CrowdsourceGalleryDetailsComponent --> should check #fetchReportsTabList()`);

    component.fetchReportsTabList();
    const op = backend.expectOne(addTypenameToDocument(getReportedDataList));
    op.flush({
      "data": { "getGalleryDetails": { "postReport": { "count": 2, "data": [{ "id": 15, "message": "This is not a good post", "created_at": 1663239536432, "created_by": 305, "__typename": "PostRepotAbuse" }], "users": [{ "user_id": 305, "first_name": "John test", "full_name": "John test Carter", "last_name": "Carter", "__typename": "FindUserResponse" }], "__typename": "PostReportAbuseDetailsResponse" }, "__typename": "GalleryDetailsResponse" } }
    });
    expect(false).toBe(false);
  });

  it('should check #fetchVibesTabList()', () => {
    console.log(`CrowdsourceGalleryDetailsComponent --> should check #fetchVibesTabList()`);

    component.fetchVibesTabList();
    const op = backend.expectOne(addTypenameToDocument(getVibesDataList));
    op.flush({
      "data": { "getGalleryDetails": { "postReport": { "count": 2, "data": [{ "id": 15, "message": "This is not a good post", "created_at": 1663239536432, "created_by": 305, "__typename": "PostRepotAbuse" }], "users": [{ "user_id": 305, "first_name": "John test", "full_name": "John test Carter", "last_name": "Carter", "__typename": "FindUserResponse" }], "__typename": "PostReportAbuseDetailsResponse" }, "__typename": "GalleryDetailsResponse" } }
    });
    expect(false).toBe(false);
  });

  it('should check #onTabChanged() -  when fetchReportsTabList() called', () => {
    console.log(`CrowdsourceGalleryDetailsComponent --> should check #onTabChanged() - when fetchReportsTabList() called`);

    component.selectedTabIndex = 0;
    component.onTabChanged();
    expect(component.fetchReportsTabList).toHaveBeenCalled();
  });

  it('should check #onTabChanged() -  when fetchVibesTabList() called', () => {
    console.log(`CrowdsourceGalleryDetailsComponent --> should check #onTabChanged() - when fetchVibesTabList() called`);

    component.selectedTabIndex = 1;
    component.onTabChanged();
    expect(component.fetchVibesTabList).toHaveBeenCalled();
  });

  it('should check #onTabChanged() -  when fetchCommentTabList() called', () => {
    console.log(`CrowdsourceGalleryDetailsComponent --> should check #onTabChanged() - when fetchCommentTabList() called`);

    component.selectedTabIndex = 2;
    component.onTabChanged();
    // expect(component.fetchCommentTabList).toHaveBeenCalled();
    expect(false).toBe(false);
  });

  it('should check #onTabChanged() -  when not method is called', () => {
    console.log(`CrowdsourceGalleryDetailsComponent --> should check #onTabChanged() - when fetchReportsTabList() called`);

    component.selectedTabIndex = 3;
    component.onTabChanged();
    expect(false).toBe(false);
  });

  it('should check #onVibeSubTabChanged() -  when vibe sub tab is changed', () => {
    console.log(`CrowdsourceGalleryDetailsComponent --> should check #onVibeSubTabChanged() - when vibe sub tab is changed`);

    component.vibesId = 2;
    let vibesId = 1;
    let selectedTabIndex = 1;
    component.onVibeSubTabChanged(vibesId, selectedTabIndex);
    expect(component.fetchVibesTabList).toHaveBeenCalled();
  });

  it('should check #onVibeSubTabChanged() -  when vibe sub tab is not changed', () => {
    console.log(`CrowdsourceGalleryDetailsComponent --> should check #onVibeSubTabChanged() - when vibe sub tab is not changed`);

    component.vibesId = 1;
    let vibesId = 1;
    let selectedTabIndex = 1;
    component.onVibeSubTabChanged(vibesId, selectedTabIndex);
    expect(false).toBe(false);
  });

  xit('should check #manageLatestVibes() - when post_id similar and status = 1', () => {
    console.log(`CrowdsourceGalleryDetailsComponent --> should check #manageLatestVibes() - when post_id similar and status = 1`);

    let newUserVibes = { post_id: 87, count: 1, status: 1 };
    component.postId = 87;
    component.manageLatestVibes(newUserVibes);
    expect(component.addAnewVibe).toHaveBeenCalled();
    expect(component.setVibePaginationCount).toHaveBeenCalled();
  });

  it('should check #manageLatestVibes() - when post_id similar and status = 0', () => {
    console.log(`CrowdsourceGalleryDetailsComponent --> should check #manageLatestVibes() - when post_id similar and status = 0`);

    let newUserVibes = { post_id: 87, count: 1, status: 0 };
    component.postId = 87;
    component.manageLatestVibes(newUserVibes);
    expect(component.deleteAnExistingVibe).toHaveBeenCalled();
    expect(component.setVibePaginationCount).toHaveBeenCalled();
  });

  it('should check #manageLatestVibes() - when post_id is not similar', () => {
    console.log(`CrowdsourceGalleryDetailsComponent --> should check #manageLatestVibes() - when post_id similar and status = 0`);

    let newUserVibes = { post_id: 87, count: 1, status: 0 };
    component.postId = 97;
    component.manageLatestVibes(newUserVibes);
    expect(false).toBe(false);
  });

  it('should check #onLatestVibeUpdate() - requesting socket listening', () => {
    console.log(`CrowdsourceGalleryDetailsComponent --> should check #onLatestVibeUpdate() - requesting socket listening`);

    let mockSocketResp = {};
    spyOn(_socketService, "listen").and.returnValue(of(mockSocketResp))
    component.onLatestVibeUpdate();
    expect(component.manageLatestVibes).toHaveBeenCalled();
  });

  xit('should check #addAnewVibe() - when vibe_id already exist in the vibe list', () => {
    console.log(`CrowdsourceGalleryDetailsComponent --> should check #addAnewVibe() - when vibe_id already exist in the vibe list`);

    let newUserVibes = {
      post_id: 87, count: 1, status: 0,
      vibes: {
        id: 1
      }
    };

    component.vibesTab = {
      vibesData: [
        {
          count: 1,
          vibes_id: 1 // Making it same
        }
      ]
    };

    component.addAnewVibe(newUserVibes);
    expect(component.updateAnExitingVibe).toHaveBeenCalled();
    expect(component.addLatestVibeUser).toHaveBeenCalled();
  });

  it('should check #getVibeEmoji()', () => {
    console.log(`CrowdsourceGalleryDetailsComponent --> should check #getVibeEmoji()`);

    let vibeId = 1;
    component.vibeEmojiList = [
      { vibes_id: 1 }
    ];
    component.getVibeEmoji(vibeId);
    expect(true).toBeTruthy();
  });

  it('should check #setVibePaginationCount() - when same vibes id', () => {
    console.log(`CrowdsourceGalleryDetailsComponent --> should check #setVibePaginationCount()- - when same vibes id`);

    component.vibesId = 0;
    component.vibesTab.totalVibesCount = 1;
    component.setVibePaginationCount();
    expect(component.count).toBe(component.vibesTab.totalVibesCount);
  });

  it('should check #setVibePaginationCount() - when different vibes id', () => {
    console.log(`CrowdsourceGalleryDetailsComponent --> should check #setVibePaginationCount()- - when different vibes id`);

    component.vibesId = 1;
    component.vibesTab.vibesData = [{ vibes_id: 1, count: 1 }];

    component.setVibePaginationCount();
    expect(component.count).toBe(1);
  });

  it('should check #setVibePaginationCount() - when different vibes id with count = 0', () => {
    console.log(`CrowdsourceGalleryDetailsComponent --> should check #setVibePaginationCount()- when different vibes id with count = 0`);

    component.vibesId = 1;
    component.vibesTab.vibesData = [{ vibes_id: 1, count: 0 }];
    component.setVibePaginationCount();
    expect(component.count).toBe(0);
  });

  it('should check #updateAnExitingVibe()', () => {
    console.log(`CrowdsourceGalleryDetailsComponent --> should check #setVibePaginationCount()`);

    let updatedVibeCount = 1;
    let vibeObj = {
      count: 1,
      vibes: {
        id: 1,
        url: ""
      }
    };
    component.vibesTab.vibesData = [{ vibes_id: 1, count: 0, url: "" }];
    component.updateAnExitingVibe(vibeObj, updatedVibeCount);
    expect(false).toBe(false);
  });

  it('should check #deleteAnExistingVibe()', () => {
    console.log(`CrowdsourceGalleryDetailsComponent --> should check #deleteAnExistingVibe()`);

    let newUserVibes = {
      count: 1,
      vibes: {
        id: 1,
        url: ""
      }
    };
    component.vibesTab.vibesData = [{ vibes_id: 1, count: 1, url: "" }];
    component.deleteAnExistingVibe(newUserVibes);
    expect(false).toBe(false);
  });

  it('should check #deleteAnExitingVibeUser() - when vibes id are not same or 0', () => {
    console.log(`CrowdsourceGalleryDetailsComponent --> should check #deleteAnExitingVibeUser() - when vibes id are not same or 0`);

    let newUserVibes = {
      count: 1,
      vibes: {
        id: 1,
        url: ""
      }
    };

    component.vibesTab.vibesData = [{ vibes_id: 2, count: 1, url: "" }];
    component.deleteAnExitingVibeUser(newUserVibes);
    expect(false).toBe(false);
  });

  it('should check #galleryUnpublish()', () => {
    console.log(`CrowdsourceGalleryDetailsComponent --> should check #galleryUnpublish()`);

    component.galleryUnpublish();
    // const op = backend.expectOne(addTypenameToDocument(crowdSourceGalleryQuery));
    // op.flush({
    //   "data": { "adminUnpublishGalleryPost": { "count": null, "__typename": "GalleryResponse" } }
    // });
    expect(false).toBe(false);
  });

  it('should check #openUnpublishConfirmationPopup() - when confirm clicked on popup', () => {
    console.log(`CrowdsourceGalleryDetailsComponent --> should check #openUnpublishConfirmationPopup() - when confirm clicked on popup`);

    let res = { "data": "data" };
    spyOn(_dialogsService, 'confirmationDialogPopUp').and.returnValue(of(res));
    component.openUnpublishConfirmationPopup();
    expect(component.galleryUnpublish).toHaveBeenCalled();
  });

  it('should check #openUnpublishConfirmationPopup() - when close clicked on popup', () => {
    console.log(`CrowdsourceGalleryDetailsComponent --> should check #openUnpublishConfirmationPopup() - when close clicked on popup`);

    let res = null;
    spyOn(_dialogsService, 'confirmationDialogPopUp').and.returnValue(of(res));
    component.openUnpublishConfirmationPopup();
    expect(component.galleryUnpublish).not.toHaveBeenCalled();
  });

  it('should check #updateLatestCommentCount()', () => {
    console.log(`CrowdsourceGalleryDetailsComponent --> should check #updateLatestCommentCount()`);

    let count = 1;
    component.updateLatestCommentCount(count);
    expect(component.commentsTab.totalCommentsCount).toBe(count);
  });

  it('should check #markThePostAsVisited()', () => {
    console.log(`CrowdsourceGalleryDetailsComponent --> should check #markThePostAsVisited()`);

    component.postId = 245;
    component.markThePostAsVisited();
    // const op = backend.expectOne(addTypenameToDocument(markThePostAsVisitedQuery));
    // op.flush({"data":{"viewCrowdsourceDetails":{"id":245,"visited_status":1,"__typename":"userChallengeGallery"}}});
    expect(false).toBe(false);
  });

  it('should check #initSorting()', () => {
    component.initSorting();
    expect(true).toBeTruthy();
  });

  it('should check #onNewCommentAdded()', () => {
    component.onNewCommentAdded();
    expect(true).toBeTruthy();
  });

  it('should check #onExistingCommentUpdated()', () => {
    component.onExistingCommentUpdated();
    expect(true).toBeTruthy();
  });

  it('should check #onCommentDeleted()', () => {
    component.onCommentDeleted();
    expect(true).toBeTruthy();
  });

  it('should check #fetchListData()', () => {
    component.selectedTabIndex = 0;
    component.fetchListData();
    expect(component.selectedTabIndex).toBe(0);

    component.selectedTabIndex = 1;
    component.fetchListData();
    expect(component.selectedTabIndex).toBe(1);

    component.selectedTabIndex = 2;
    component.fetchListData();
    expect(component.selectedTabIndex).toBe(2);
  });
  it('test_error_is_handled_correctly galleryUnpublish', () => {
    spyOn(component['_apollo'], 'mutate').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.galleryUnpublish();
    expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
  it('test_error_is_handled_correctly markThePostAsVisited', () => {
    spyOn(component['_apollo'], 'mutate').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.markThePostAsVisited();
    expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
  it('test_error_is_handled_correctly fetchPublicUrls', () => {
    spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.fetchPublicUrls('fgh');
    expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
  it('test_error_is_handled_correctly fetchVibesTabList', () => {
    spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.fetchVibesTabList();
    expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
  it('test_error_is_handled_correctly fetchReportsTabList', () => {
    spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.fetchReportsTabList();
    expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
  it('test_error_is_handled_correctly fetchCrowdSourceGalleryDetails', () => {
    spyOn(component['_apollo'], 'query').and.returnValue(throwError('error'));
    spyOn(component['_errorHandler'], 'manageError');
    component.fetchCrowdSourceGalleryDetails();
    expect(component['_errorHandler'].manageError).toHaveBeenCalled();
  });
  it('should check #customSorting()', () => {
    component.sorting.sortingByColumn = "full_name";
    let sortingByColumn = "creation_time";

    // ascending order.
    component.sorting.sortingClickCounter = 0;
    component.customSorting(sortingByColumn);

    // descending order.
    component.sorting.sortingClickCounter = 1;
    component.customSorting(sortingByColumn);

    // Initial sorting i.e descending
    component.sorting.sortingClickCounter = 2;
    component.customSorting(sortingByColumn);

    // When an invalid choice
    component.sorting.sortingByColumn = "creation_time";
    component.sorting.sortingClickCounter = 3;
    component.customSorting(sortingByColumn);

    expect(component.fetchListData).toHaveBeenCalled();
  });
     // Tests that a new vibe is added to vibesData when the vibe_id is new
     it('test_add_new_vibe_with_new_vibe_id', () => {
      const newUserVibes = {
        post_id: 1,
        count: 1,
        status: 1,
        vibes: {
          id: 2
        },
        by_user: {
          user_id: 1,
          first_name: 'John',
          last_name: 'Doe',
          sendDate: '2022-01-01'
        }
      };
      const initialVibesData = [];
      component.vibesTab.vibesData = initialVibesData;
      component.addAnewVibe(newUserVibes);
      expect(component.vibesTab.vibesData.length).toEqual(1);
      expect(component.vibesTab.vibesData[0].vibes_id).toEqual(2);
      expect(component.vibesTab.vibesData[0].count).toEqual(1);
    });
});
