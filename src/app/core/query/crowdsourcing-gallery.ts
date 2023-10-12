import { gql } from 'apollo-angular';

// Soucs admin - CrowdsourceListComponent:- Fetch grid view or list view gallery data
export const crowdSourceGalleryQuery = gql`
query($page:Float!,$limit:Float!,$fetchVia:String!,$adminViewType:String!,$userType:String!,$mediaType:String!, $searchTerm:String!, $searchType:String!, $orderBy:String!, $order:String!){
  fetchAdminCrowdSourceGallery(getGalleryInput:{
    page:$page,
    limit:$limit,
    fetchVia:$fetchVia,
    adminViewType:$adminViewType
    userType:$userType, 
    mediaType:$mediaType,
    searchType: $searchType,
    searchTerm: $searchTerm,
    orderBy: $orderBy,
    order: $order
  }){
    gallery {
      id,
      challenge_id,
      full_name,
      ugcUploadType,
      createdAt,
      title,
      vibesCount,
      commentsCount,
      reportsCount,
      ugcvideourl,
      ugcimageurl,
      ugcvideothumbnil,
      blob
    },
    count
  }
}`;

// Fetch the public urls by passing the array of image/video id.
export const fetchImageVideoUrlquery = gql`
query($names: [String!]!){
  generateChallengeReadSAS(
    names: $names
  ){
    token,
    uri,
    name
  }
}`;

// Soucs admin - CrowdsourceGalleryDetailsComponent:- 
// Photo / Video details
export const getGalleryDetails = gql`
query($page:Float!,$limit:Float!,$postDetailType:String!,$post_id:Float!){
  getGalleryDetails(postReportAbuseDetailsInput:{
    page: $page
    limit: $limit
    postDetailType: $postDetailType
    post_id: $post_id
  }){
    gallerData {
      id
      full_name
      createdAt
      ugcimageurl
      ugcvideourl
      ugcvideothumbnil
      ugcUploadType
      title
      postCount
      vibesCount
      commentsCount
      postCount,
      challenge_id
    }
  }
}`;

// Soucs admin - CrowdsourceGalleryDetailsComponent:- 
// Report data list
export const getReportedDataList = gql`
query($page:Float!,$limit:Float!,$postDetailType:String!,$post_id:Float!,$orderBy:String, $order:String){
  getGalleryDetails(postReportAbuseDetailsInput:{
    page: $page
    limit: $limit
    postDetailType: $postDetailType
    post_id: $post_id,
    orderBy: $orderBy,
    order: $order
  }){
    postReport {
      count
      data {
        id
        message
        created_at
        created_by
      }
      users {
        user_id
        first_name
        full_name
        last_name
      }
    }
  }
}`;

// Soucs admin - CrowdsourceGalleryDetailsComponent:- 
// Vibes data list
export const getVibesDataList = gql`
query($page:Float!,$limit:Float!,$postDetailType:String!,$vibe_id:Float!, $post_id: Float!, $orderBy:String, $order:String){
  getGalleryDetails(postReportAbuseDetailsInput:{
    page: $page
    limit: $limit
    postDetailType: $postDetailType
    vibe_id: $vibe_id,
    post_id: $post_id,
    orderBy: $orderBy,
    order: $order
  }){
    vibes {
      count
      data {
        count
        vibes_id
        url
      }
      users {
        vibes_id
        full_name
        first_name
        last_name
        blob
        created_by
        vibesUrl
        created_at
      }
    }
  }
}`;

// Soucs admin - CrowdsourceGalleryDetailsComponent:- 
// Comments data for comment tab
export const getCommentsDataList = gql`
query($page:Float!,$limit:Float!,$postDetailType:String!,$post_id:Float!, $orderBy:String!, $order:String!){
  getGalleryDetails(postReportAbuseDetailsInput:{
    page: $page
    limit: $limit
    postDetailType: $postDetailType
    post_id: $post_id,
    orderBy: $orderBy,
    order: $order
  }){
    comments{
      count,
      data {
        data{
          id,
          challenge_id,
          post_id,
          created_at
        },
        messages{
          id,
          message,
          colorId
        },
        users{
          full_name
        }
      }
    }
  }
}`;

// Unpublish a gallery post i.e image/video
export const unpublishGalleryPostQuery = gql`
mutation($post_id:Float!, $challenge_id:String!, $actionType: String!){
  adminUnpublishGalleryPost(adminUnpublishInput:{
    post_id: $post_id,
    challenge_id: $challenge_id,
    actionType: $actionType
  }){
    viewStatus
  } 
}`;

// Query to mark the post as viewed / visited
export const markThePostAsVisitedQuery = gql`
mutation($id:Float!){
  viewCrowdsourceDetails(id:$id){
    id,
    visited_status
  }
}`