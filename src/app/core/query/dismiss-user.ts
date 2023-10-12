import { gql } from 'apollo-angular';

// School admin - Dismiss student request query.
export const dismissStudentRequestQuery = gql`
mutation($dismissType:Float!, $dismissReason:String!, $dismissDescription:String!, $user_id:Float!){
  dismissStudent(dismissStudentInput:{
    dismissType: $dismissType
    dismissReason: $dismissReason
    dismissDescription: $dismissDescription
    user_id: $user_id
  }){
    userids,
    status,
    schoolverifystatus
  }
}`;

// SOUCS Admin - Fetch dismiss user list.
export const dismissedUserListQuery = gql`
query($page:Float!,$keyword:String!,$query:String!,$limit:Float!,$orderBy:String!,$order:String!){
  dismissList(userDismissListInput:{
    page:$page,
    keyword:$keyword,
    query:$query,
    limit:$limit,
    orderBy:$orderBy,
    order:$order
  }){
    count,
    users{
      user_id,
      first_name,
      last_name,
      date_of_birth,
      email,
      account_status,
      dismissReason,
      dismissStatus,
      trackSchoolId
    },
    school{
      id,
      schoolName,
      nces,
      stateName
    }
    schoolAdmin{
      schoolid,
      name,
      email,
      phone
    }
  }
}`;

// SOUCS Admin - get dismissed user information
export const userDismissInformationQuery = gql`
query($user_id:Float!){
  userDismissInformation(dismissUserInfoInput:{
    user_id:$user_id
  }){
    user{
      user_id,
      full_name,
      date_of_birth,
      email,
      phone,
      account_status,
      dismissStatus
    },
    school{
      schoolName,
      nces,
      cityName,
      stateName      
    },
    schoolAdmin {
      name,
      email,
      phone
    }
  }
}`;

export const userDismissDetailsQuery = gql`
query($user_id:Float!,$page:Float!,$limit:Float!){
  userDismissDetails(userDismissDetailInput:{
    user_id:$user_id,
    page: $page,
    limit: $limit
  }){
    count,
    schoolAdmin {
      id,
      name
    },
    data{
      school_admin_id,
      mode,
      reason,
      creation_time,
      description,
    }
  }
}`

