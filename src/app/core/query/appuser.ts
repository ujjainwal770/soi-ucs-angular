import { gql } from 'apollo-angular';

export const getAppUserQuery = gql`
query($page:Float!,$keyword:String!,$query:String!,$filter:String!,$limit:Float!, $user_type:String!, $orderBy:String!, $order:String!){
  adminPortalAppUserList(appUserListInput:{
    page:$page,
    keyword:$keyword,
    query:$query,
    filter:$filter,
    limit:$limit,
    user_type: $user_type,
    orderBy: $orderBy,
    order: $order
  }){
    users{
      user_id,
      first_name,
      last_name,
      date_of_birth,
      country_code,
      phone,
      email,
      schoolverifystatus,
      school_id,
      account_status,
      ucs_status,
      reportabusecount,
      creation_time
    },
    schools{
      id,
      schoolName
    },
    count
  }
}`

export const userTypeOptionQuery = gql`
{
  getUserTypeOptionList {
    options {
      text,
      query
    }
  }
}`

export const userStatusOptionQuery = gql`
{
  getUserStatusOptionList {
    options {
      text,
      query
    }
  }
}`

export const userReportAbuseQuery = gql`
query($page:Float!,$keyword:String!,$query:String!,$limit:Float!,$user_type:String!,$orderBy:String!,$order:String!){
  userReportAbuseList(userReportAbuseListInput:{
    page:$page,
    keyword:$keyword,
    query:$query,
    limit:$limit,
    user_type:$user_type,
    orderBy:$orderBy,
    order:$order
  }){
    users{
      user_id,
      first_name,
      last_name,
      date_of_birth,
      email,
      ucs_status,
      reportabusecount,
      account_status
    },
    count
  }
}`

export const userReportAbuseInformationQuery = gql`
query($user_id:Float!){
  reportAbuseUserInformation(reportAbuseUserInfoInput:{
    user_id:$user_id
  }){
    user{
      user_id,
      first_name,
      last_name,
      date_of_birth,
      email,
      ucs_status,
      account_status,
      reportabusecount,
      phone
    },
    school{
      schoolName,
      addressFirst,
      addressSecond
    },
    
  }
}`

export const userDetailsQuery = gql`
query($id:Float!){
  getUserViewDetail(id:$id){
    user_id,
    full_name,
    first_name,
		last_name,
    date_of_birth,
    email,
    creation_time,
    account_status,
    totalbadge,
    totalpoints,
    inclusioncount,
    inclusionResult,
    ucs_status,
    school_id,
    schoolName,
    schoolAddress
    stateName,
    cityName,
    stateAbbreviation,
    zipcode,
    schoolStateAbbreviation,
    schoolCityName,
    schoolZipcode,
    nces,
    reqSchoolId,
    reqSchoolName
  }
}`;

export const userReportAbuseDetailQuery = gql`
query($user_id:Float!,$page:Float!,$limit:Float!){
  userReportAbuseDetails(userReportAbuseDetailsInput:{
    user_id:$user_id,
    page: $page,
    limit: $limit
  }){
    data{
      reported_by,
      creation_time,
      reason
    },
    users{
      user_id,
      first_name,
      last_name
    },
    count
  }
}`;

export const userSearchByOptionQuery = gql`
{
  getUserSearchByList {
    options {
      text,
      query
    }
  }
}`

export const appUserActiveStatusQuery = gql`
  mutation userActivateDeactivate(
    $user_id: Float!,
    $status: String!
  ) {
    userActivateDeactivate(userActivateDeactivateInput: {
      user_id: $user_id,
      status: $status,   
    }) {
      user {
        user_id,
        account_status
      }
      
    }
}`;

// Fetch school name in a particular state
export const fetchSchoolByKeywordAndStateQuery = gql`
query($keyword:String!,$statename:String!,$page:Float!){
  findSchoolsByKeywordAndState(SchoolsByStateNameInput:{
    keyword:$keyword,
    statename: $statename,
    page: $page
  }){
		id,
		schoolName,
		stateName,
		cityName,
		zipcode
		nces
	}
}`;

// Fetch school name in a particular state
export const findSchoolsByStateQuery = gql`
query($statename:String!){
  findSchoolsByState(
    stateName: $statename
  ){
		id,
		schoolName,
		stateName,
		cityName,
		zipcode,
    nces
	}
}`;

// Save user details
export const saveUserDetailQuery = gql`
mutation updateUserBySoucsAdmin(
  $user_id: Float!,
  $first_name: String!,
  $last_name:String!,
  $date_of_birth:Float!,
  $ucs_status:String!,
  $school_id:Float,
  $stateName: String,
  $cityName: String,
  $zipcode: String
) {
  updateUserBySoucsAdmin(updateSUserBySoucsAdminInput: {
    user_id: $user_id,
		first_name: $first_name,
		last_name: $last_name,
		date_of_birth: $date_of_birth,
		ucs_status: $ucs_status,
		school_id: $school_id,
    stateName: $stateName,
    cityName: $cityName,
    zipcode: $zipcode
  }) {
    user_id,
    email
  }
}`;
