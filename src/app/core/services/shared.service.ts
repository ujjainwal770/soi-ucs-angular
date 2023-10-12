import { Injectable } from '@angular/core';
import { AppConstantService } from './app-constant.service';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

  tableConfig = {
    appUserListing: { sortingData: { ...this._const.APP_USER_LIST_DEFAULT_SORTING }, filteringData: { ...this._const.APP_USER_LIST_DEFAULT_FILTERING } },
    rewardListing: { sortingData: { ...this._const.REWARD_LIST_DEFAULT_SORTING },filteringData: { ...this._const.REWARD_LIST_DEFAULT_FILTERING } },
    archiveRewardListing: { sortingData: { ...this._const.REWARD_LIST_DEFAULT_SORTING },filteringData: { ...this._const.REWARD_LIST_DEFAULT_FILTERING } },
    schoolListing: { sortingData: { ...this._const.SCHOOL_LIST_DEFAULT_SORTING }, filteringData: { ...this._const.APP_SCHOOL_LIST_DEFAULT_FILTERING } },
    adminUserListing: { sortingData: { ...this._const.ADMIN_USER_LIST_DEFAULT_SORTING }, filteringData: { ...this._const.ADMIN_USER_LIST_DEFAULT_FILTERING } },
    cannedMessageListing: { sortingData: { ...this._const.CANNED_MSG_LIST_DEFAULT_SORTING } },
    challengeAbuseListing: { sortingData: { ...this._const.CHALLENGE_ABUSE_LIST_DEFAULT_SORTING } },
    adminRoleListing: { sortingData: { ...this._const.ADMIN_ROLE_LIST_DEFAULT_SORTING } },
    reportAbuseListing: { sortingData: { ...this._const.REPORT_ABUSE_LIST_DEFAULT_SORTING },filteringData: { ...this._const.REPORT_ABUSE_LIST_DEFAULT_FILTERING } },
    manageTagListing: { sortingData: { ...this._const.MANAGE_TAG_LIST_DEFAULT_SORTING } },
    crowdsourceListing: { sortingData: { ...this._const.CROWDSOURCE_LIST_DEFAULT_SORTING }, filteringData: { ...this._const.CROWDSOURCE_LIST_DEFAULT_FILTERING } },
    galleryDetailReportedTabListing: { sortingData: { ...this._const.CROWDSOURCE_DETAIL_REPORTED_TAB_DEFAULT_SORTING } },
    galleryDetailVibesTabListing: { sortingData: { ...this._const.CROWDSOURCE_DETAIL_VIBES_TAB_DEFAULT_SORTING } },
    galleryDetailCommentsTabListing: { sortingData: { ...this._const.CROWDSOURCE_DETAIL_COMMENTS_TAB_DEFAULT_SORTING } },
    dismissStudentListing: { sortingData: { ...this._const.DISMISS_STUDENTS_LIST_DEFAULT_SORTING },filteringData : {...this._const.DISMISS_STUDENTS_LIST_DEFAULT_FILTERING} },
    appManageUser:{ sortingData: { ...this._const.APP_MANAGE_USER_DEFAULT_SORTING }},
    appBroadcastMessageListing:{ sortingData: { ...this._const.APP_MANAGE_BROADCAST_MESSAGE_DEFAULT_SORTING }},
    winnerListing: { sortingData: { ...this._const.APP_WINNER_LIST_DEFAULT_SORTING } },
    eventListing: { sortingData: { ...this._const.APP_EVENT_LIST_DEFAULT_SORTING } },
    participantsList:{ sortingData: { ...this._const.APP_USER_LIST_DEFAULT_SORTING } },
  };

  crowdsourceListActiveTabIndex = 0;
  crowdsourceListActiveViewStyle = 'grid_view';

  soucsAdminDetails: any; // contains the value of soucs admin detail / profile details.
  schoolAdminDetails: any; // contains the value of school admin detail / profile details.

  constructor(
    private _const: AppConstantService
  ) { }


  // Custom sorting getter
  getSortingData(page) {
    return this.tableConfig[page].sortingData;
  }

  // Custom sorting setter
  setSortingData(page, value) {
    this.tableConfig[page].sortingData = value;
  }
  // Custom filtering getter
  getFilteringData(page) {
    return this.tableConfig[page].filteringData;
  }

  // Custom sorting setter
  setFilteringData(page, value) {
    this.tableConfig[page].filteringData = value;
  }
}
