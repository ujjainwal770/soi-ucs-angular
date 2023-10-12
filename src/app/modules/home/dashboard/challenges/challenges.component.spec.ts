import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { InMemoryCache } from '@apollo/client/cache';
import { addTypenameToDocument } from '@apollo/client/utilities/graphql/transform';
import { ApolloTestingController, ApolloTestingModule, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import gql from 'graphql-tag';
import { ToastrModule,ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/core/services/http.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';
import { ChallengesComponent } from './challenges.component';

describe('ChallengesComponent', () => {
  let component: ChallengesComponent;
  let fixture: ComponentFixture<ChallengesComponent>;
  let backend: ApolloTestingController;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChallengesComponent ],
      imports:[RouterTestingModule,
        ToastrModule.forRoot(),
        HttpClientModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ApolloTestingModule,
        MaterialModule,
      ],
      providers:[ToastrService,HttpService,LocalStorageService,
        {
          provide: APOLLO_TESTING_CACHE,
          useValue: new InMemoryCache({
             addTypename: true
          }),
       }]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChallengesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    backend = TestBed.get(ApolloTestingController);
    spyOn(component,'getChallengesTitle').and.callThrough();
    spyOn(component,'getAnalytics').and.callThrough();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  xit('should getfilteredCategories', () => {
    // component.challengeCategories = [
    //   {
    //     badgeCategory: "Learn",
    //     challengeId: "0000017d-517c-d286-ab7d-ff7eef8b0000",
    //     title: "Growing as a Leader",
    //     __typename: "BrightSpotModifiedChallengeResponse"
    //   },
    //   {
    //     badgeCategory: "Include",
    //     challengeId: "0000017d-518d-d286-ab7d-ffef09440000",
    //     title: "Spread the Word Challenge 5 ",
    //     __typename: "BrightSpotModifiedChallengeResponse"
    //   }
    // ]
    component.getfilteredCategories(1,'category')
    expect(component.getfilteredCategories).toBeTruthy();
  });
  const soucsChallengeIDQuery = gql `
  {
    topChallegesPlayedByAll{
      challenge_id,
      count
    }
  }`;
  const soucsChallengeTitleQuery = gql `
  {
    getChallengesFromBrightSpotOkta{
        challengeId
        title
        badgeCategory
      }
  }`;
  it('should test getChallengesTitle', () => {
  
    const op = backend.expectOne(addTypenameToDocument(soucsChallengeTitleQuery));
    component.getChallengesTitle()
    op.flush({"data":{"getChallengesFromBrightSpotOkta":[{"challengeId":"0000017d-517c-d286-ab7d-ff7eef8b0000","title":"Growing as a Leader","badgeCategory":"Learn","__typename":"BrightSpotModifiedChallengeResponse"},{"challengeId":"0000017d-518d-d286-ab7d-ffef09440000","title":"Spread the Word Challenge 5 ","badgeCategory":"Include","__typename":"BrightSpotModifiedChallengeResponse"},{"challengeId":"0000017d-518d-d286-ab7d-ffeffc210000","title":"Identity with Nickelodeon!\r\n","badgeCategory":"Learn","__typename":"BrightSpotModifiedChallengeResponse"},{"challengeId":"0000017d-5193-d286-ab7d-fff31fe50000","title":"Spread the Word Challenge 4 ","badgeCategory":"Include","__typename":"BrightSpotModifiedChallengeResponse"},{"challengeId":"0000017d-5193-d286-ab7d-fff3639a0000","title":"Inside Inclusion with Warren HS\r\n","badgeCategory":"Learn","__typename":"BrightSpotModifiedChallengeResponse"},{"challengeId":"0000017d-5197-d286-ab7d-fff7e6380000","title":"Be An Upstander","badgeCategory":"Learn","__typename":"BrightSpotModifiedChallengeResponse"},{"challengeId":"0000017d-519a-d286-ab7d-fffa45040000","title":"Take a Virtual Field Trip with KPMG","badgeCategory":"Learn","__typename":"BrightSpotModifiedChallengeResponse"},{"challengeId":"0000017d-519a-d286-ab7d-fffaef770000","title":"Spread the Word Challenge 3 ","badgeCategory":"Include","__typename":"BrightSpotModifiedChallengeResponse"},{"challengeId":"0000017d-519f-d286-ab7d-ffff3f950000","title":"What's going on in Texas?","badgeCategory":"Learn","__typename":"BrightSpotModifiedChallengeResponse"},{"challengeId":"0000017d-51a0-d286-ab7d-ffe221140000","title":"Spread the Word Challenge 2","badgeCategory":"Include","__typename":"BrightSpotModifiedChallengeResponse"},{"challengeId":"0000017d-51a1-d286-ab7d-ffe354660000","title":"Get up and move","badgeCategory":"Move","__typename":"BrightSpotModifiedChallengeResponse"},{"challengeId":"0000017d-51a2-d286-ab7d-ffe2d9be0000","title":"Spread the Word Challenge 1 ","badgeCategory":"Include","__typename":"BrightSpotModifiedChallengeResponse"},{"challengeId":"0000017d-51a4-d286-ab7d-ffe6aaa80000","title":"Mindful Meditation","badgeCategory":"Move","__typename":"BrightSpotModifiedChallengeResponse"},{"challengeId":"0000017d-51a5-d286-ab7d-ffe71d870000","title":"Healthy Snacks Vlog","badgeCategory":"Include","__typename":"BrightSpotModifiedChallengeResponse"},{"challengeId":"0000017d-51a7-d286-ab7d-ffe7e9790000","title":"Cheer for Inclusion","badgeCategory":"Include","__typename":"BrightSpotModifiedChallengeResponse"},{"challengeId":"0000017d-51a9-d286-ab7d-ffebe2d90000","title":"Day in the Life","badgeCategory":"Include","__typename":"BrightSpotModifiedChallengeResponse"},{"challengeId":"0000017d-51aa-d286-ab7d-ffea299b0000","title":"School of Strength - Welcome & Warmup","badgeCategory":"Move","__typename":"BrightSpotModifiedChallengeResponse"},{"challengeId":"0000017d-51ae-d286-ab7d-ffee62730000","title":"Thank a teacher!","badgeCategory":"Include","__typename":"BrightSpotModifiedChallengeResponse"},{"challengeId":"0000017d-51af-d286-ab7d-ffef30e20000","title":"Athlete Paparazzi!","badgeCategory":"Include","__typename":"BrightSpotModifiedChallengeResponse"},{"challengeId":"0000017d-51b0-d286-ab7d-fff2ea6f0000","title":"Act it Out!","badgeCategory":"Include","__typename":"BrightSpotModifiedChallengeResponse"},{"challengeId":"0000017e-4760-d2a9-abff-f76896a70000","title":"No Thumbs! Challenge","badgeCategory":"Include","__typename":"BrightSpotModifiedChallengeResponse"},{"challengeId":"0000017e-7cb9-dabd-ab7e-7ffb99920000","title":"Random 1","badgeCategory":"Include","__typename":"BrightSpotModifiedChallengeResponse"},{"challengeId":"0000017e-7cbd-dabd-ab7e-7fff929e0000","title":"Random 1 video","badgeCategory":"Move","__typename":"BrightSpotModifiedChallengeResponse"},{"challengeId":"0000017e-7cf8-dabd-ab7e-7ffacc6e0000","title":"Single: Random 2 audio","badgeCategory":"Move","__typename":"BrightSpotModifiedChallengeResponse"},{"challengeId":"0000017e-7cf9-dabd-ab7e-7ffbab6e0000","title":"Random 3","badgeCategory":"Move","__typename":"BrightSpotModifiedChallengeResponse"},{"challengeId":"0000017e-7d01-dabd-ab7e-7fc32cad0000","title":"Random 3 video","badgeCategory":"Learn","__typename":"BrightSpotModifiedChallengeResponse"},{"challengeId":"0000017e-7d04-dabd-ab7e-7fc6872a0000","title":"Growing as a Leader  - multiple answer dummy","badgeCategory":"Learn","__typename":"BrightSpotModifiedChallengeResponse"},{"challengeId":"0000017e-7d06-dabd-ab7e-7fc6897f0000","title":"Growing as a Leader multiple answer dummy video","badgeCategory":"Learn","__typename":"BrightSpotModifiedChallengeResponse"},{"challengeId":"0000017e-7d06-dabd-ab7e-7fc6d4520000","title":"Be An Upstander- dummy ","badgeCategory":"Learn","__typename":"BrightSpotModifiedChallengeResponse"},{"challengeId":"0000017e-7d07-dabd-ab7e-7fc737580000","title":"Growing as a Leader-single answer dummy video","badgeCategory":"Move","__typename":"BrightSpotModifiedChallengeResponse"},{"challengeId":"0000017e-7d07-dabd-ab7e-7fc769cb0000","title":"Be An Upstander - dummy 2","badgeCategory":"Learn","__typename":"BrightSpotModifiedChallengeResponse"},{"challengeId":"0000017e-7d07-dabd-ab7e-7fc7d5d70000","title":"Be An Upstander - dummy 3","badgeCategory":"Learn","__typename":"BrightSpotModifiedChallengeResponse"},{"challengeId":"0000017e-7d08-dabd-ab7e-7fca5d8c0000","title":"Growing as a Leader-single answer dummy iamge","badgeCategory":"Move","__typename":"BrightSpotModifiedChallengeResponse"},{"challengeId":"0000017e-7d08-dabd-ab7e-7fca7ae60000","title":"Be An Upstander - dummy 4","badgeCategory":"Learn","__typename":"BrightSpotModifiedChallengeResponse"}]}});
    expect(component.datasource).toBeDefined();
    // backend.verify();
  });
  
  it('should test getAnalytics', () => {
    component.getAnalytics()
    const op = backend.expectOne(addTypenameToDocument(soucsChallengeIDQuery));
    
    op.flush({"data":{"topChallegesPlayedByAll":[{"challenge_id":"0000017d-517c-d286-ab7d-ff7eef8b0000","count":8,"__typename":"TopChallengeResponse"},{"challenge_id":"0000017d-51a1-d286-ab7d-ffe354660000","count":6,"__typename":"TopChallengeResponse"},{"challenge_id":"0000017d-51ae-d286-ab7d-ffee62730000","count":1,"__typename":"TopChallengeResponse"},{"challenge_id":"0000017e-7d08-dabd-ab7e-7fca7ae60000","count":1,"__typename":"TopChallengeResponse"},{"challenge_id":"0000017d-55ff-d286-ab7d-ffff27020000","count":1,"__typename":"TopChallengeResponse"},{"challenge_id":"0000017e-7d04-dabd-ab7e-7fc6872a0000","count":1,"__typename":"TopChallengeResponse"},{"challenge_id":"0000017d-51aa-d286-ab7d-ffea299b0000","count":1,"__typename":"TopChallengeResponse"},{"challenge_id":"0000017d-51a2-d286-ab7d-ffe2d9be0000","count":1,"__typename":"TopChallengeResponse"},{"challenge_id":"0000017e-7d01-dabd-ab7e-7fc32cad0000","count":1,"__typename":"TopChallengeResponse"},{"challenge_id":"0000017d-5193-d286-ab7d-fff31fe50000","count":1,"__typename":"TopChallengeResponse"}]}});
    expect(component.datasource).toBeDefined();
    // backend.verify();
  });
});
