import { HttpClientModule } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { InMemoryCache } from '@apollo/client/cache';
import { addTypenameToDocument } from '@apollo/client/utilities';
import { ApolloTestingController, ApolloTestingModule, APOLLO_TESTING_CACHE } from 'apollo-angular/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { getSchoolTopRewardApplicants, getSchoolTopRewards, getSoucsTopRewardApplicants, getSoucsTopRewards } from 'src/app/core/query/rewards';
import { HttpService } from 'src/app/core/services/http.service';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { MaterialModule } from 'src/app/shared/module/material/material.module';

import { RewardsWidgetComponent } from './rewards-widget.component';

describe('RewardsWidgetComponent', () => {
  let component: RewardsWidgetComponent;
  let fixture: ComponentFixture<RewardsWidgetComponent>;
  let backend: ApolloTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RewardsWidgetComponent],
      imports: [RouterTestingModule,
        ToastrModule.forRoot(),
        HttpClientModule,
        BrowserAnimationsModule,
        HttpClientTestingModule,
        ApolloTestingModule,
        MaterialModule,
      ],
      providers: [ToastrService, HttpService, LocalStorageService,
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
    fixture = TestBed.createComponent(RewardsWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    backend = TestBed.inject(ApolloTestingController);

    spyOn(component, 'getTopRewardApplicants').and.callThrough();
    spyOn(component, 'getTopRewards').and.callThrough();

  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should check #getTopRewardApplicants() - when school admin', () => {
    console.log(`RewardsWidgetComponent --> should check #getTopRewardApplicants() - when school admin`);

    component.isSchoolAdmin = true; //school admin
    component.getTopRewardApplicants();
    const op = backend.expectOne(addTypenameToDocument(getSchoolTopRewardApplicants));
    op.flush({
      "data": { "schoolRewardApplicantBoard": { "rewardsApplicant": [{ "userName": "Mercy Challenge Test Test", "userType": "YES", "totalRewardSubmitted": 1, "totalRewardsWon": 1, "__typename": "rewardLeaderBoardResponse" }], "__typename": "AllDashboardResponses" } }
    });
    expect(component.top10RewardApplicants.dataSource).toBeDefined();
  });

  it('should check #getTopRewardApplicants() - when soucs admin', () => {
    console.log(`RewardsWidgetComponent --> should check #getTopRewardApplicants() - when soucs admin`);

    component.isSchoolAdmin = false; //soucs admin
    component.getTopRewardApplicants();
    const op = backend.expectOne(addTypenameToDocument(getSoucsTopRewardApplicants));
    op.flush({
      "data": { "soucsRewardApplicantBoard": { "rewardsApplicant": [{ "userName": "John test Carter", "userType": "NO", "totalRewardSubmitted": 5, "totalRewardsWon": 2, "__typename": "rewardLeaderBoardResponse" }], "__typename": "AllDashboardResponses" } }
    });
    expect(component.top10RewardApplicants.dataSource).toBeDefined();
  });

  it('should check #getTopRewards() - when school admin', () => {
    console.log(`RewardsWidgetComponent --> should check #getTopRewards() - when school admin`);

    component.isSchoolAdmin = true; //school admin
    component.getTopRewards();
    const op = backend.expectOne(addTypenameToDocument(getSchoolTopRewards));
    op.flush({
      "data": { "schoolRewardsLeaderboard": { "rewards": [{ "rewardName": "Attend an ESPN Top 5 Banner Presentation__28", "userSubmissionNo": 1, "winnerName": "Dashboard 105", "userType": "YES", "__typename": "RewardWinnersResponse" }], "__typename": "AllDashboardResponses" } }
    });
    expect(component.top10Rewards.dataSource).toBeDefined();
  });

  it('should check #getTopRewards() - when soucs admin', () => {
    console.log(`RewardsWidgetComponent --> should check #getTopRewards() - when soucs admin`);

    component.isSchoolAdmin = false; //soucs admin
    component.getTopRewards();
    const op = backend.expectOne(addTypenameToDocument(getSoucsTopRewards));
    op.flush({
      "data": { "soucsRewardsLeaderboard": { "rewards": [{ "rewardName": "Attend an ESPN Top 5 Banner Presentation__6", "userSubmissionNo": 6, "winnerName": "Rahul Modi", "userType": "NO", "__typename": "RewardWinnersResponse" }], "__typename": "AllDashboardResponses" } }
    });
    expect(component.top10Rewards.dataSource).toBeDefined();
  });

});
