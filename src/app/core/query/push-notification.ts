import { gql } from '@apollo/client/core';

// School Admin:- To start push notification service i.e udpate device id.
export const schoolAdminUpdateDeviceIdQuery = gql`
mutation($device_id:String!, $status:String!){
    updateAdminDeviceId(adminDeviceInput:{
        device_id: $device_id,
        status: $status
    }){
        admin_id
        status
    }
}`;

// SOUCS Admin:- To start push notification service i.e udpate device id.
export const soucsAdminUpdateDeviceIdQuery = gql`
mutation($device_id:String!, $status:String!){
  updateSoucsAdminDeviceId(adminDeviceInput:{
        device_id: $device_id,
        status: $status
    }){
      admin_email
      status
    }
}`;

// School Admin:- Fetch all notification for the list
export const schoolAdminNotificationListQuery = gql`
query($page:Float!,$limit:Float!,$filter:String!){
    getSchoolAdminNotificationList(adminNotificationListInput:{
    page: $page,
    limit: $limit,
    filter: $filter
  }){
    count
    unread_count
    notifications{
      id
      notification_id
      is_read
      title
      body
      creation_time
    }
  }
}`

// SOUCS Admin:- Fetch all notification for the list
export const soucsAdminNotificationListQuery = gql`
query($page:Float!,$limit:Float!,$filter:String!){
    getSoucsAdminNotificationList(adminNotificationListInput:{
    page: $page,
    limit: $limit,
    filter: $filter
  }){
    count
    unread_count
    notifications{
      id
      notification_id
      is_read
      title
      body
      creation_time
      action_id
    }
  }
}`
// SOUCS Admin:- Update Soucs admin read/unread status
export const updateSoucsAdminReadStatusQuery = gql`
mutation updateSoucsAdminNotificationReadStatus($input:NotificationReadStatusInput!){
  updateSoucsAdminNotificationReadStatus(notificationReadStatusInput: $input){
    id
    is_read
  }
}`

// School Admin:- Update School admin read/unread status
export const updateSchoolAdminReadStatusQuery = gql`
mutation updateSchoolAdminNotificationReadStatus($input:NotificationReadStatusInput!){
  updateSchoolAdminNotificationReadStatus(notificationReadStatusInput: $input){
    id
    is_read
  }
}`
// soucs Admin:- Dismiss soucs admin 
export const dismissSoucsAdminQuery = gql`
mutation updateSoucsAdminNotificationDismissStatus($input:NotificationDismissInput!){
  updateSoucsAdminNotificationDismissStatus(notificationDismissInput: $input){
    id
    status
  }
}`;

// School Admin:- Dismiss school admin 
export const dismissSchoolAdminQuery = gql`
mutation updateSchoolAdminNotificationDismissStatus($input:NotificationDismissInput!){
  updateSchoolAdminNotificationDismissStatus(notificationDismissInput: $input){
    id
    status
  }
}`;

// School Admin:- Fetch all unread notification count
export const schoolAdminUnreadNotificationCountQuery = gql`
query($page:Float!,$limit:Float!,$filter:String!){
  getSchoolAdminNotificationList(adminNotificationListInput:{
    page: $page,
    limit: $limit,
    filter: $filter
  }){
    count
    unread_count
  }
}`

// SOUCS Admin:- Fetch all unread notification count
export const soucsAdminUnreadNotificationCountQuery = gql`
query($page:Float!,$limit:Float!,$filter:String!){
    getSoucsAdminNotificationList(adminNotificationListInput:{
    page: $page,
    limit: $limit,
    filter: $filter
  }){
    count
    unread_count
  }
}`
