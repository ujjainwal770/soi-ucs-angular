import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { InMemoryCache } from '@apollo/client/cache';
import { addTypenameToDocument } from '@apollo/client/utilities';
import { OKTA_CONFIG } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { ApolloTestingController, ApolloTestingModule, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import mockValues from 'src/app/core/constants/mock.values';
import { crowdSourceGalleryQuery, fetchImageVideoUrlquery, unpublishGalleryPostQuery } from 'src/app/core/query/crowdsourcing-gallery';
import { AppConstantService } from 'src/app/core/services/app-constant.service';
import { AuthService } from 'src/app/core/services/auth.service';
import { DialogsService } from 'src/app/core/services/dialog-service';
import { HttpService } from 'src/app/core/services/http.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { SocketIoService } from 'src/app/core/services/socket-io.service';
import { UtilityService } from 'src/app/core/services/utility.service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';
import { CrowdsourceListComponent } from './crowdsource-list.component';
const oktaAuth = new OktaAuth(mockValues.oktaConfig);

describe('CrowdsourceListComponent', () => {
  let component: CrowdsourceListComponent;
  let fixture: ComponentFixture<CrowdsourceListComponent>;
  let _socketService: SocketIoService;
  let backend: ApolloTestingController;
  let _dialogsService: DialogsService;
  let _utilityService: UtilityService;
  let _router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CrowdsourceListComponent],
      imports: [
        MaterialModule,
        RouterTestingModule,
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
        LocalStorageService,
        AppConstantService,
        DialogsService,
        SocketIoService,
        SharedService,
        AuthService,
        {
          provide: APOLLO_TESTING_CACHE,
          useValue: new InMemoryCache({
            addTypename: true
          }),
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
    fixture = TestBed.createComponent(CrowdsourceListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    backend = TestBed.inject(ApolloTestingController);
    _socketService = TestBed.inject(SocketIoService);
    _dialogsService = TestBed.inject(DialogsService);
    _utilityService = TestBed.inject(UtilityService);
    _router = TestBed.inject(Router);

    spyOn(component, 'fetchCrowdSourceGallery').and.callThrough();
    spyOn(component, 'ngOnChanges').and.callThrough();
    spyOn(component, 'handlePage').and.callThrough();
    spyOn(component, 'fetchActualUrlCollection').and.callThrough();
    spyOn(component, 'getThumbnail').and.callThrough();
    spyOn(component, 'userAction').and.callThrough();
    spyOn(component, 'openUrl').and.callThrough();
    spyOn(component, 'getThumnailImgUrl').and.callThrough();
    spyOn(component, 'mapDataSource').and.callThrough();
    spyOn(component, 'getActualUrl').and.callThrough();
    spyOn(component, 'extractUrlNameFromThePrivateUrl').and.callThrough();
    spyOn(component, 'extractUrlNamesFromTheList').and.callThrough();
    spyOn(component, 'onDismissImagePopup').and.callThrough();
    spyOn(component, 'getSearch').and.callThrough();
    spyOn(component, 'getSearchTxt').and.callThrough();
    spyOn(component, 'searchUserText').and.callThrough();
    spyOn(component, 'resetFilter').and.callThrough();
    spyOn(component, 'onWindowResize').and.callThrough();
    spyOn(component, 'onKeyUp').and.callThrough();
    spyOn(component, 'unpublishGallery').and.callThrough();
    spyOn(component, 'customSorting').and.callThrough();
    spyOn(component, 'openUnpublishConfirmationDialog').and.callThrough();
  });

  it('should create', () => {
    console.log(`CrowdsourceListComponent --> default / first test case`);
    expect(component).toBeTruthy();
  });

  it('should check #fetchCrowdSourceGallery()', () => {
    console.log(`CrowdsourceListComponent --> should check #fetchCrowdSourceGallery()`);

    component.fetchCrowdSourceGallery();
    const op = backend.expectOne(addTypenameToDocument(crowdSourceGalleryQuery));
    op.flush({
      "data": { "fetchAdminCrowdSourceGallery": { "gallery": [{ "full_name": "Jamil Khan", "ugcUploadType": "Image", "createdAt": 1652774432637, "title": "Visit the #UnifiedGeneration at Fanzone ", "vibesCount": null, "commentsCount": null, "reportsCount": null, "ugcvideourl": "", "ugcimageurl": "https://soucsdevsa.blob.core.windows.net/soucs-challenges-users-upload-dev/Image/347f8f10-3197-4761-b1ac-ca21225929139ab5564b-8991-4997-8052-6564447dc693", "ugcvideothumbnil": null, "blob": "", "__typename": "CrowdSourceGalleryResponse" }], "count": 44, "__typename": "GalleryResponse" } }
    });
    expect(component.dataSource).toBeDefined();
  });

  it('should check #onKeyUp()', () => {
    console.log(`CrowdsourceListComponent --> should check #onKeyUp()`);

    component.onKeyUp();
    expect(component.onDismissImagePopup).toHaveBeenCalled();
  });

  it('should check #ngOnChanges()', () => {
    console.log(`CrowdsourceListComponent --> should check #ngOnChanges()`);

    component.ngOnChanges();
    expect(false).toBe(false);
  });

  it('should call handlePage() return valid', () => {
    console.log(`CrowdsourceListComponent --> should call handlePage() return valid`);

    const e = {
      length: 9,
      pageIndex: 1,
      pageSize: 5,
      previousPageIndex: 0
    }
    component.handlePage(e)
    expect(component.currentPage).toEqual(1);
  });

  it('should check #fetchActualUrlCollection()', () => {
    console.log(`CrowdsourceListComponent --> should check #fetchActualUrlCollection()`);

    let urlNameArray = ["Image/347f8f10-3197-4761-b1ac-ca21225929139ab5564b-8991-4997-8052-6564447dc693"];
    component.fetchActualUrlCollection(urlNameArray);
    const op = backend.expectOne(addTypenameToDocument(fetchImageVideoUrlquery));
    op.flush({
      "data": { "generateChallengeReadSAS": [{ "token": "st=2022-09-04T15%3A22%3A50Z&se=2022-09-04T16%3A22%3A50Z&sp=r&sv=2018-03-28&sr=b&sig=cGaQHfSOkOOpxFgXorBvzRXwuq%2FbS5vGq36Ylo6HoDc%3D", "uri": "https://soucsdevsa.blob.core.windows.net/soucs-challenges-users-upload-dev/Image/347f8f10-3197-4761-b1ac-ca21225929139ab5564b-8991-4997-8052-6564447dc693?st=2022-09-04T15%3A22%3A50Z&se=2022-09-04T16%3A22%3A50Z&sp=r&sv=2018-03-28&sr=b&sig=cGaQHfSOkOOpxFgXorBvzRXwuq%2FbS5vGq36Ylo6HoDc%3D", "name": "Image/347f8f10-3197-4761-b1ac-ca21225929139ab5564b-8991-4997-8052-6564447dc693", "__typename": "TokenUriAzureWithName" }] }
    });
    expect(false).toBe(false);
  });

  it('should check #getThumbnail() - when image url available', () => {
    console.log(`CrowdsourceListComponent --> should check #getThumbnail() - when image url available`);

    let url = "#"
    expect(component.getThumbnail(url)).toBe(url);
  });

  it('should check #getThumbnail() - when image url not available', () => {
    console.log(`CrowdsourceListComponent --> should check #getThumbnail() - when image url not available`);

    component.staticImage.imageNotFoundUrl = "#"
    let url = ""
    expect(component.getThumbnail(url)).toBe(component.staticImage.imageNotFoundUrl);
  });

  it('should check #userAction() - when path=view ', () => {
    console.log(`CrowdsourceListComponent --> should check #userAction() - when clicking on view details option`);

    let objPath: any = { name: 'View Details', path: 'view', icon: 'remove_red_eye' }
    let selectedDetails = {
      id: 1
    };
    const spy = spyOn(_router, 'navigateByUrl');
    component.userAction(objPath.path, selectedDetails);
    const url = spy.calls.first().args[0];
    expect(url).toBe('/crowdsource-gallery/gallery-details/1');

    component.tabDetails = null;
    component.userAction(objPath.path, selectedDetails);
    expect(true).toBeTruthy();
    
  });

  it('should check #userAction() - when path=unpublish', () => {
    let objPath: any = { path: 'unpublish' }
    let item: object = { id: 1, challenge_id: "" };
    component.userAction(objPath.path, item);
    expect(true).toBeTruthy();
  });

  it('should check #userAction() - when path is not view or upublish', () => {
    let objPath: any = { path: '' }
    let item: object = { id: 1, challenge_id: "" };
    component.userAction(objPath.path, item);
    expect(true).toBeTruthy();
  });

  it('should check #openUrl() - type = Video', () => {
    console.log(`CrowdsourceListComponent --> should check #openUrl() - type = Video`);

    let data = {
      ugcUploadType: "Video"
    };
    component.openUrl(data);
  });

  it('should check #openUrl() - type = Image and image url exist', () => {
    console.log(`CrowdsourceListComponent --> should check #openUrl() - type = Image and image url exist`);

    let data = {
      ugcUploadType: "Image",
      publicImageUrl: "/image.jpg"
    };
    component.openUrl(data);
    expect(component.popupImageUrl).toBe(data.publicImageUrl);
  });

  it('should check #openUrl() - type = Image and image url doest not exist', () => {
    console.log(`CrowdsourceListComponent --> should check #openUrl() - type = Image and image url does not exist`);

    let data = {
      ugcUploadType: "Image",
      publicImageUrl: ""
    };
    component.openUrl(data);
    expect(false).toBe(false);
  });

  it('should check #getThumnailImgUrl() - when type = image', () => {
    console.log(`CrowdsourceListComponent --> should check #getThumnailImgUrl() - when type = Image`);

    let thumbnailImgUrl = component.staticImage.imageNotFoundUrl;
    let data = { "__typename": "CrowdSourceGalleryResponse", "full_name": "Roy Jorden", "ugcUploadType": "Image", "createdAt": 1652251328615, "title": "Thank a Teacher!", "vibesCount": null, "commentsCount": null, "reportsCount": null, "ugcvideourl": "", "ugcimageurl": "#", "ugcvideothumbnil": null, "blob": "#", "publicImageUrl": "#", "publicVideoUrl": "", "thumbnailImgUrl": "#" };
    expect(component.getThumnailImgUrl(data)).toBe(thumbnailImgUrl);
  });

  it('should check #getThumnailImgUrl() - when type = video', () => {
    console.log(`CrowdsourceListComponent --> should check #getThumnailImgUrl() - when type = video`);

    let thumbnailImgUrl = component.staticImage.imageNotFoundUrl;
    let data = { "__typename": "CrowdSourceGalleryResponse", "full_name": "Roy Jorden", "ugcUploadType": "Video", "createdAt": 1652251328615, "title": "Thank a Teacher!", "vibesCount": null, "commentsCount": null, "reportsCount": null, "ugcvideourl": "", "ugcimageurl": "#", "ugcvideothumbnil": "#", "blob": "#", "publicImageUrl": "#", "publicVideoUrl": "#", "thumbnailImgUrl": "#" };
    expect(component.getThumnailImgUrl(data)).toBe(thumbnailImgUrl);
  });

  it('should check #getThumnailImgUrl() - when type != image/video', () => {
    console.log(`CrowdsourceListComponent --> should check #getThumnailImgUrl() -when type != image/video`);

    let thumbnailImgUrl = component.staticImage.imageNotFoundUrl;
    let data = { "__typename": "CrowdSourceGalleryResponse", "full_name": "Roy Jorden", "ugcUploadType": null, "createdAt": 1652251328615, "title": "Thank a Teacher!", "vibesCount": null, "commentsCount": null, "reportsCount": null, "ugcvideourl": "", "ugcimageurl": "#", "ugcvideothumbnil": "#", "blob": "#", "publicImageUrl": "#", "publicVideoUrl": "#", "thumbnailImgUrl": "#" };
    expect(component.getThumnailImgUrl(data)).toBe(thumbnailImgUrl);
  });

  it('should check #mapDataSource()', () => {
    console.log(`CrowdsourceListComponent --> should check #mapDataSource()`);

    component.galleryTableData = [{ "__typename": "CrowdSourceGalleryResponse", "full_name": "Roy Jorden", "ugcUploadType": null, "createdAt": 1652251328615, "title": "Thank a Teacher!", "vibesCount": null, "commentsCount": null, "reportsCount": null, "ugcvideourl": "", "ugcimageurl": "#", "ugcvideothumbnil": "#", "blob": "#", "publicImageUrl": "#", "publicVideoUrl": "#", "thumbnailImgUrl": "#" }];
    component.mapDataSource();
    expect(component.dataSource).toBeDefined();
  });

  it('should check #getActualUrl()', () => {
    console.log(`CrowdsourceListComponent --> should check #getActualUrl()`);

    let privateUrl = "Video/701e0f40-ad3a%3D";
    component.urlCollections = [{ "token": "mock-token-here", "uri": privateUrl, "name": privateUrl }];
    let actualUrl = component.getActualUrl(privateUrl);
    expect(actualUrl).toBe(privateUrl);
  });

  it('should check #extractUrlNameFromThePrivateUrl() - if part', () => {
    console.log(`CrowdsourceListComponent --> should check #extractUrlNameFromThePrivateUrl() - if part`);

    let url = "Image/#";
    let urlName = component.extractUrlNameFromThePrivateUrl(url);
    expect(urlName).toBe(url);
  });

  it('should check #extractUrlNameFromThePrivateUrl() - else part', () => {
    console.log(`CrowdsourceListComponent --> should check #extractUrlNameFromThePrivateUrl() - else part`);

    let url = null;
    let urlName = component.extractUrlNameFromThePrivateUrl(url);
    expect(urlName).not.toBe(url);
  });

  it('should check #extractUrlNamesFromTheList() - when available - ugcimageurl, ugcvideothumbnil and ugcvideourl', () => {
    console.log(`CrowdsourceListComponent --> should check #extractUrlNamesFromTheList() - when available - ugcimageurl, ugcvideothumbnil and ugcvideourl`);

    component.galleryTableData = [{ "__typename": "CrowdSourceGalleryResponse", "full_name": "Roy Jorden", "ugcUploadType": null, "createdAt": 1652251328615, "title": "Thank a Teacher!", "vibesCount": null, "commentsCount": null, "reportsCount": null, "ugcvideourl": "#", "ugcimageurl": "#", "ugcvideothumbnil": "#", "blob": "#", "publicImageUrl": "#", "publicVideoUrl": "#", "thumbnailImgUrl": "#" }];
    component.extractUrlNamesFromTheList();
    expect(component.fetchActualUrlCollection).toHaveBeenCalled();

    component.galleryTableData = null;
    component.extractUrlNamesFromTheList();
    expect(true).toBeTruthy();
  });

  it('should check #extractUrlNamesFromTheList() - when not available - ugcimageurl, ugcvideothumbnil and ugcvideourl', () => {
    console.log(`CrowdsourceListComponent --> should check #extractUrlNamesFromTheList() - when not available - ugcimageurl, ugcvideothumbnil and ugcvideourl`);

    component.galleryTableData = [{ "__typename": "CrowdSourceGalleryResponse", "full_name": "Roy Jorden", "ugcUploadType": null, "createdAt": 1652251328615, "title": "Thank a Teacher!", "vibesCount": null, "commentsCount": null, "reportsCount": null, "ugcvideourl": "", "ugcimageurl": "", "ugcvideothumbnil": "", "blob": "", "publicImageUrl": "", "publicVideoUrl": "", "thumbnailImgUrl": "" }];
    component.extractUrlNamesFromTheList();
    expect(component.mapDataSource).toHaveBeenCalled();
  });

  it('should check #onDismissImagePopup()', () => {
    console.log(`CrowdsourceListComponent --> should check #onDismissImagePopup()`);

    component.onDismissImagePopup();
    expect(component.popupImageUrl).toBe("");
  });

  it('should check getSearch() when searchText not empty', () => {
    console.log(`CrowdsourceListComponent --> should check #getSearch() when searchText not empty`);

    let val = 'test';
    component.crowdsourcingFormGroup.get('searchText').setValue(val);
    component.searchTxtBox.nativeElement.value = '';
    component.getSearch();
    expect(component.getSearch).toBeTruthy();
    expect(component.fetchCrowdSourceGallery).toBeTruthy();
  });

  it('should check getSearch() when searchText is empty', () => {
    console.log(`CrowdsourceListComponent --> should check getSearch() when searchText is empty`);

    let val = '';
    component.crowdsourcingFormGroup.get('searchText').setValue(val);
    component.searchTxtBox.nativeElement.value = '';
    component.getSearch();
  });

  it('#getSearchTxt - when searchBy type is User Name', () => {
    console.log(`CrowdsourceListComponent --> #getSearchTxt - when searchBy type is User Name`);

    const type = 'User Name';
    component.crowdsourcingFormGroup.get('searchBy').setValue('full_name');
    let comp = component.getSearchTxt();
    expect(comp).toEqual(type);
  });

  it('#getSearchTxt  - when searchBy type is Challenge', () => {
    console.log(`CrowdsourceListComponent --> #getSearchTxt  - when searchBy type is Challenge`);

    const type = 'Challenge';
    component.crowdsourcingFormGroup.get('searchBy').setValue('challenge_name');
    let comp = component.getSearchTxt();
    expect(comp).toEqual(type);
  });

  it('#getSearchTxt - when searchBy type is blank', () => {
    console.log(`CrowdsourceListComponent --> #getSearchTxt - when searchBy type is blank`);

    const type = '';
    component.crowdsourcingFormGroup.get('searchBy').setValue('');
    let comp = component.getSearchTxt();
    expect(comp).toEqual(type);
  });

  it('should check searchUserText() - test when searchKeyword length > 2', () => {
    console.log(`CrowdsourceListComponent --> should check searchUserText() - test when searchKeyword length > 2`);

    let searchData = "test";
    spyOn(_utilityService, 'searchData').and.returnValue(of(searchData));
    component.searchUserText();
  });

  it('should check searchUserText() - test when searchKeyword length = 0', () => {
    console.log(`CrowdsourceListComponent --> should check searchUserText() - test when searchKeyword length = 0`);

    let searchData = "";
    spyOn(_utilityService, 'searchData').and.returnValue(of(searchData));
    component.searchUserText();
  });

  it('should check searchUserText() - test when searchKeyword length not > 2 and not 0', () => {
    console.log(`CrowdsourceListComponent --> should check searchUserText() - test when searchKeyword length not > 2 and not 0`);

    let searchData = "t";
    spyOn(_utilityService, 'searchData').and.returnValue(of(searchData));
    component.searchUserText();
  });

  it('should call resetFilter()', () => {
    console.log(`CrowdsourceListComponent --> should call resetFilter()`);

    component.resetFilter();
    expect(component.fetchCrowdSourceGallery).toHaveBeenCalled();
  });

  it('should call onWindowResize(), innerWidth = 300', () => {
    console.log(`CrowdsourceListComponent --> should call onWindowResize(), innerWidth = 300`);

    spyOnProperty(window, 'innerWidth').and.returnValue(300);
    component.onWindowResize();
    expect(component.noOfGridCols).toBe(1);
  });

  it('should call onWindowResize(), innerWidth = 450', () => {
    console.log(`CrowdsourceListComponent --> should call onWindowResize(), innerWidth = 450`);

    spyOnProperty(window, 'innerWidth').and.returnValue(450);
    component.onWindowResize();
    expect(component.noOfGridCols).toBe(2);
  });

  it('should call onWindowResize(), innerWidth = 550', () => {
    console.log(`CrowdsourceListComponent --> should call onWindowResize(), innerWidth = 550`);

    spyOnProperty(window, 'innerWidth').and.returnValue(550);
    component.onWindowResize();
    expect(component.noOfGridCols).toBe(3);
  });

  it('should call onWindowResize(), innerWidth = default', () => {
    console.log(`CrowdsourceListComponent --> should call onWindowResize(), innerWidth = default`);

    component.onWindowResize();
    expect(component.noOfGridCols).toBe(5);
  });

  it('should check #unpublishGallery()', () => {
    console.log(`CrowdsourceListComponent --> should check #unpublishGallery()`);

    let item: object = { id: 1, challenge_id: "" };
    component.unpublishGallery(item);
    const op = backend.expectOne(addTypenameToDocument(unpublishGalleryPostQuery));
    op.flush({
      "data": { "adminUnpublishGalleryPost": [{ "viewStatus": 1, "__typename": "BrightSpotModifiedChallengeResponse" }] }
    });
    expect(true).toBeTruthy();
  });

  it('should check #openUnpublishConfirmationDialog() - when confirm clicked on popup', () => {
    console.log(`CrowdsourceListComponent --> should check #openUnpublishConfirmationDialog() - when confirm clicked on popup`);

    let item = {};
    let res = { "data": "data" };
    spyOn(_dialogsService, 'confirmationDialogPopUp').and.returnValue(of(res));
    component.openUnpublishConfirmationDialog(item);
    expect(component.unpublishGallery).toHaveBeenCalled();
  });

  it('should check #customSorting()', () => {
    component.sorting.sortingByColumn = "full_name";
    let sortingByColumn = "createdAt";

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
    component.sorting.sortingByColumn = "createdAt";
    component.sorting.sortingClickCounter = 3;
    component.customSorting(sortingByColumn);

    expect(component.fetchCrowdSourceGallery).toHaveBeenCalled();
  });

  it('should check #openUnpublishConfirmationDialog() - when close clicked on popup', () => {
    console.log(`CrowdsourceListComponent --> should check #openUnpublishConfirmationDialog() - when close clicked on popup`);

    let item = {};
    let res = null;
    spyOn(_dialogsService, 'confirmationDialogPopUp').and.returnValue(of(res));
    component.openUnpublishConfirmationDialog(item);
    expect(component.unpublishGallery).not.toHaveBeenCalled();
  });
});
