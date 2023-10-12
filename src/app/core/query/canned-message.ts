import { gql } from 'apollo-angular';

// Publish a canned message - query
export const publishCannedMessageQuery = gql`
mutation($message:String!, $colorId:Float!, $publish: Float!){
  addCannedMessage(cannedMessageInput:{
    message: $message,
    colorId: $colorId,
    publish: $publish
  }){
    id,
    message,
    colorId,
    publish
  } 
}`;

// Get canned message color list
export const getCannedMessageColorQuery = gql`query{
  fetchCannedMessageColor{
    id
    hasColor
    status
  }
}`;

// Fetch all canned messages list
export const fetchCannedMessagesList = gql`
query($page:Float!,$limit:Float!,$fetchVia:String!,$orderBy:String!, $order:String!){
  fetchAdminCannedMessage(fetchCannedMessageInput:{
    page:$page,
    limit:$limit,
    fetchVia: $fetchVia,
    orderBy: $orderBy,
    order: $order
  }){
    cannedMessageList {
      id,
      message,
      colorId,
      hasColor,
      publish,
      created_at
    },
    count
  }
}`;

// Unpublish a canned message - query
export const unpublishCannedMessageQuery = gql`
mutation($id:Float!){
  unpublishCannedMessage(unpublishCannedMessageInput:{
    id: $id
  }){
    id,
    message,
    colorId,
    publish
  } 
}`;

// Re-Publish a canned message - query
export const rePublishCannedMessageQuery = gql`
mutation($id:Float!){
  publishCannedMessage(publishCannedMessageInput:{
    id: $id
  }){
    id,
    message,
    colorId,
    publish,
    created_by
  } 
}`;