import { gql } from 'apollo-angular';
// send broadcast message - query
export const sendBroadcastMessageQuery = gql`
mutation($message:String!, $expiration_date:Float!, ){
    sendBroadcastMessage(sendBroadcastMessageInput:{
    message: $message,
    expiration_date: $expiration_date,
  }){
    id,
    message,
    expiration_date,
  }
}`;

//fetch list of broadcast messaages
export const getBroadcastMessageList = gql`
query($page:Float!,$limit:Float!,$orderBy:String!, $order:String!){
  getBroadcastMessageList(broadcastMessageListInput:{
    page:$page,
    limit:$limit,
    orderBy: $orderBy,
    order: $order
  }){
    broadcastMessage {
      id,
      message,
      publish_date,
      expiration_date,
      status
    },
    count
  }
}`;

//get broadcast message details
export const getBroadcastMessageDetailQuery = gql`
query($id:Float!){
  getBroadcastMessageDetail(id:$id){
      id,
      message,
      expiration_date,
      publish_date,
      status,
      archive_at,
      is_archive
  }
}`;

//
export const archiveMessageQuery = gql`
mutation($id:Float!){
  archiveBroadcastMessage(id:$id){
    id
  }
}`;


//edit broadcast message
export const editBroadcastMessageQuery = gql`
mutation($id:Float,$message:String!, $expiration_date:Float!){
    sendBroadcastMessage(sendBroadcastMessageInput:{
    id: $id,
    message: $message,
    expiration_date: $expiration_date,
  }){
    id,
    message,
    expiration_date,
  }
}`;

