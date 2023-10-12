import { gql } from 'apollo-angular';

// School admin - User status
export const userStatusListQuery = gql`
  {
    userstatusList {
      options {
        query,
        text
      }
    }
  }`

// School admin - search options
export const searchOptionsQuery = gql`
{
  getUserOptionList {
    options{
      query,text
    }
  }
}`;

// School admin - get student detail for the list page
export const studentQuery = gql`
query($page:Float!,$keyword:String!,$query:String!,$filter:String!,$limit:Float!,$orderBy:String!, $order:String!){
  findUsersSearchByQuery(userQuerySearchOptionInput:{
    page:$page,
    keyword:$keyword,
    query:$query,
    filter:$filter,
    limit:$limit,
    orderBy: $orderBy,
    order: $order
  }){
    users{
      first_name,
      last_name,
      email,
      date_of_birth,
      country_code,
      phone,
      schoolverifystatus,
      user_id,
      school_id,
      registeredStatus,
      reqSchoolId
    },
    count
  }
}`;

// School admin - update status
export const updateStatusQuery = gql`
mutation updateSchoolAdminUserStatus(
  $userids:[Float!]!,
  $message:String!,
  $status:String!,
  
){
  updateSchoolAdminUserStatus(userAdminApprovalInput:{
    userids:$userids,
    message:$message,
    status:$status,
  }){
    userids,
    status,
    message,
    schoolverifystatus
  }
}`;

// School admin - get student detail by passing its user id
export const getStudentDetailsByIdQuery = gql`
query($user_id:Float!){
  getPreapprovedStudentDetails(user_id:$user_id){
    user_id
    first_name
    last_name
    email
    date_of_birth
    phone
  }
}`;

// School admin - Update student detail based on its user_id.
export const updateStudentDetailsQuery = gql`
mutation($user_id:Float!, $fname:String!, $lname: String!, $email:String!, $dob:Float!, $mobile_no:String!, $send_invite:String!){
  updatePreapprovedStudentDetails(updatePreapprovedStudentInput:{
    user_id: $user_id,
    fname: $fname,
    lname: $lname,
    email: $email,
    dob: $dob,
    mobile_no: $mobile_no,
    send_invite: $send_invite
  }){
    full_name,
    email
  }
}`;

export const studentaddQuery = gql`
mutation insertCorrectSingleUserData($firstName:String!, $lastName: String!, $email:String!, 
  $dob:String!, $phone:String!){
  insertCorrectSingleUserData(insertUserDataInput:{
    firstName:$firstName,
    lastName:$lastName,
    phone:$phone,
    email:$email,
    dob:$dob
  }){
    full_name,
    email
  }
}`;

// School Admin:- upate school change request i.e 'approved' / 'reject'
export const updateSchoolRequestStatusQuery = gql`
mutation($user_id:Float!, $approval_status:String!, $dismissType:Float!, $dismissReason:String!, $dismissDescription:String!){
  changeSchoolAction(schoolChangeActionInput:{
    user_id: $user_id,
    approval_status: $approval_status,
    dismissType: $dismissType
    dismissReason: $dismissReason
    dismissDescription: $dismissDescription
  }){
    school_id
    new_school_id
    status
    approval_status
  }
}`;