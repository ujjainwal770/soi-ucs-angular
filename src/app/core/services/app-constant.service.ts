import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})

// This class only contains a list of constant and readonly variables
export class AppConstantService {

  // Web socket
  readonly WEB_SOCKET = {

    // Basic configuration
    FORCE_NEW: true, UPGRADE: true, RECONNECTION_ATTEMPTS: 3, TIMEOUT: 10000, TRANSPORTS: ['websocket', 'polling'], PATH: '/backend/socket.io', ACCESS_TYPE_ADMIN: 'Admin',

    // Namespace
    CROWDSOURCE_NAMESPACE: 'crowdsource',

    // Default socket Events provided by socket-io library
    CONNECT: 'connect', CONNECT_ERROR: 'connect_error', CONNECT_FAILED: 'connect_failed', DISCONNECT: 'disconnect',

    // Custom socket Events which are need to be available on server
    HANDSHAKE_EVENT: 'hello',
    CROWDSOURCE_LATEST_USER_VIBES_EVENT: 'latestUserVibes',
    CROWDSOURCE_ON_COMMENT_ADDED_EVENT: 'latestAddUserCannedMessage',
    CROWDSOURCE_ON_COMMENT_UPDATED_EVENT: 'latestEditUserCannedMessage',
    CROWDSOURCE_ON_COMMENT_DELETED_EVENT: 'latestDeleteUserCannedMessage',

    // Custom message
    SUCCESSFULY_CONNECTED_MESSAGE: 'Successfuly connected to socket!'
  };

  // Vibe emoji list with id and its url
  readonly VIBE_EMOJI_LIST = [
    { vibes_id: '1', title: 'Thumbs Up', url: '../../assets/images/svg/vibe_thumbs-up_icon.svg' },
    { vibes_id: '2', title: 'Love', url: '../../assets/images/svg/vibe_love_icon.svg' },
    { vibes_id: '3', title: 'Hello', url: '../../assets/images/svg/vibe_hello_icon.svg' },
    { vibes_id: '4', title: 'LOL', url: '' },
    { vibes_id: '5', title: 'Applause', url: '../../assets/images/svg/vibe_applause_icon.svg' },
    { vibes_id: '6', title: 'Strength', url: '../../assets/images/svg/vibe_strength_icon.svg' },
    { vibes_id: '7', title: 'Peace', url: '../../assets/images/svg/vibe_peace_icon.svg' },
    { vibes_id: '8', title: 'Care', url: '../../assets/images/svg/vibe_care_icon.svg' },
    { vibes_id: '9', title: 'Keep it 100', url: '../../assets/images/svg/vibe_keep-it-100_icon.svg' }
  ];

  readonly REWARD_FILTER_BY_TYPE_OPTIONS: any = [
    { value: 'all', title: 'all' }, { value: 'video', title: 'Video' },
    { value: 'merchandise', title: 'Merchandise' }, { value: 'class', title: 'Class' },
    { value: 'Event', title: 'Event' }
  ];

  readonly REWARD_LIST_DEFAULT_SORTING = {
    sortingOrders: ['DESC', 'ASC'],
    currentOrder: 0,
    sortingByColumn: 'resultDate',
    sortingClickCounter: 0
  };
  readonly REWARD_LIST_DEFAULT_FILTERING = {
    type: 'all',
    searchBy: 'title',
    searchQuery: '',
    dateVal:''
  }

  readonly APP_USER_LIST_DEFAULT_SORTING = {
    sortingOrders: ['DESC', 'ASC'],
    currentOrder: 0,
    sortingByColumn: 'creation_time',
    sortingClickCounter: 0
  };
  readonly APP_USER_LIST_DEFAULT_FILTERING = {
    userType: '',
    accountStatus: '',
    searchBy: '',
    searchQuery: ''
  };
  readonly APP_EVENT_LIST_DEFAULT_SORTING = {
    sortingOrders: ['DESC', 'ASC'],
    currentOrder: 0,
    sortingByColumn: 'start_date_time',
    sortingClickCounter: 0
  };

  readonly APP_WINNER_LIST_DEFAULT_SORTING = {
    sortingOrders: ['DESC', 'ASC'],
    currentOrder: 0,
    sortingByColumn: 'resultDate',
    sortingClickCounter: 0
  };
  readonly MANAGE_TAG_LIST_DEFAULT_SORTING = {
    sortingOrders: ['DESC', 'ASC'],
    currentOrder: 0,
    sortingByColumn: 'creationTime',
    sortingClickCounter: 0
  };

  readonly REPORT_ABUSE_LIST_DEFAULT_SORTING = {
    sortingOrders: ['DESC', 'ASC'],
    currentOrder: 0,
    sortingByColumn: 'reportabusetime',
    sortingClickCounter: 0
  };
  readonly REPORT_ABUSE_LIST_DEFAULT_FILTERING = {
    userType: 'all',
    searchBy: 'full_name',
    searchQuery: ''
  };

  readonly SCHOOL_LIST_DEFAULT_SORTING = {
    sortingOrders: ['DESC', 'ASC'],
    currentOrder: 0,
    sortingByColumn: 'creationTime',
    sortingClickCounter: 0
  };
  readonly APP_SCHOOL_LIST_DEFAULT_FILTERING = {
    status: '',
    searchBy: '',
    searchQuery: '',
    filterbytype:''
  };

  readonly ADMIN_USER_LIST_DEFAULT_SORTING = {
    sortingOrders: ['DESC', 'ASC'],
    currentOrder: 0,
    sortingByColumn: 'creationTime',
    sortingClickCounter: 0
  };

  readonly ADMIN_USER_LIST_DEFAULT_FILTERING = {
    status: '',
    searchBy: '',
    searchQuery: ''
  };
  readonly CANNED_MSG_LIST_DEFAULT_SORTING = {
    sortingOrders: ['DESC', 'ASC'],
    currentOrder: 0,
    sortingByColumn: 'publish',
    sortingClickCounter: 0
  };

  readonly CHALLENGE_ABUSE_LIST_DEFAULT_SORTING = {
    sortingOrders: ['DESC', 'ASC'],
    currentOrder: 0,
    sortingByColumn: 'creation_time',
    sortingClickCounter: 0
  };

  readonly DISMISS_STUDENTS_LIST_DEFAULT_SORTING = {
    sortingOrders: ['DESC', 'ASC'],
    currentOrder: 0,
    sortingByColumn: 'dismissTime',
    sortingClickCounter: 0
  };
  readonly DISMISS_STUDENTS_LIST_DEFAULT_FILTERING = {
    searchBy: 'full_name',
    searchQuery: ''
  };

  readonly APP_MANAGE_USER_DEFAULT_SORTING = {
    sortingOrders: ['DESC', 'ASC'],
    currentOrder: 1,
    sortingByColumn: 'updation_time',
    sortingClickCounter: 0
  };

  readonly ADMIN_ROLE_LIST_DEFAULT_SORTING = {
    sortingOrders: ['DESC', 'ASC'],
    currentOrder: 0,
    sortingByColumn: 'roleName',
    sortingClickCounter: 0
  };

  readonly CROWDSOURCE_LIST_DEFAULT_SORTING = {
    sortingOrders: ["DESC", "ASC"],
    currentOrder: 0,
    sortingByColumn: "createdAt",
    sortingClickCounter: 0
  };
  readonly CROWDSOURCE_LIST_DEFAULT_FILTERING = {
    userType:'all',
    mediaType:'all',
    searchBy: 'full_name',
    searchQuery: ''
  };
  
  readonly CROWDSOURCE_DETAIL_REPORTED_TAB_DEFAULT_SORTING = {
    sortingOrders: ["DESC", "ASC"],
    currentOrder: 0,
    sortingByColumn: "created_at",
    sortingClickCounter: 0
  };

  readonly CROWDSOURCE_DETAIL_VIBES_TAB_DEFAULT_SORTING = {
    sortingOrders: ["DESC", "ASC"],
    currentOrder: 0,
    sortingByColumn: "created_at",
    sortingClickCounter: 0
  };

  readonly CROWDSOURCE_DETAIL_COMMENTS_TAB_DEFAULT_SORTING = {
    sortingOrders: ["DESC", "ASC"],
    currentOrder: 0,
    sortingByColumn: "created_at",
    sortingClickCounter: 0
  };
  readonly APP_MANAGE_BROADCAST_MESSAGE_DEFAULT_SORTING = {
    sortingOrders: ['DESC', 'ASC'],
    currentOrder: 0,
    sortingByColumn: 'publish_date',
    sortingClickCounter: 0
  };

  readonly UNPUBLISH_GALLERY_SUCCESS_MSG: any = "This challenge upload will be removed permanently from the Gallery for all users. Confirm to proceed.";

  // static images urls
  readonly STATIC_IMAGE = {

    // Crowdsourcing gallery:-
    gallery_placeholder: '../../../../assets/images/image-not-found.png',
    blob_placeholder_icon_white: '../../../../assets/images/svg/blob-placeholder-white.svg',
    play_icon: '../../../../assets/images/svg/play_icon.svg'
  }

  constructor() { }
}
