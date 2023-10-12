import { gql } from 'apollo-angular';

export const searchQuery = gql`
  query($page:Float!,$keyword:String!,
    $query:String!,$filter:String!, $limit:Float!, $orderBy:String!, $order:String!,$type:String!){
    findSchoolSearchByQuery(schoolSearchOptionInput:{
      page:$page,keyword:$keyword,query:$query,filter:$filter, limit:$limit, orderBy:$orderBy, order:$order,type:$type
    }){
      count,
      schools {
        id,
        schoolName,
        stateName,
        zipcode,
        cityName,
        creationTime,
        addressFirst,
        status,
        districtName,
        adminActiveStatus,
        nces,
        banner,
        status_text,
        deactivateReason,
        isValidUsZipCode,
        type,
        activeStudent,
        pendingStudent,
        school_admin_status
      }
    }
 }`;

export const updateSchoolStatusQuery = gql`
mutation updateSchoolStatus(
  $id: Float!,
  $status: String!,
  $deactivateReason:String!
) {
  updateSchoolStatus(updateSchoolStatusInput: {
    id: $id,
    status: $status, 
    deactivateReason: $deactivateReason  
  }) {
    id,
    status,
    deactivateReason
  }
}`;
export const SchoolDetailById = gql`query($id:Float!){
  getSchoolDetailById(id:$id){
    id,
        schoolName,
        countryName,
        stateName,
        cityName,
        districtName,
        addressFirst,
        addressSecond,
        zipcode,
        schoolProfile,
        mainName,
        mainEmail,
        mainPhone,
        creationTime,
        updationTime,
        emailNotificationStatus,
        status,
        nces,
        banner,
        isSysGenNces,
        deactivateReason,
        deactivateTime,
        isUniversity,
        type,
        status_text,
        totalStudent,
        activeStudent,
        pendingStudent,
        inActiveStudent,
        preApproveStudent,
        adminActiveStatus,
        school_admin_status
  }
}`;


export const schoolQuery = gql`query($id:Float!){
  findById(id:$id){
    id,
    schoolName,
    countryName,
    stateName,
    zipcode,
    cityName,
    creationTime,
    addressFirst,
    addressSecond,
    schoolProfile,
    mainName,
    mainEmail,
    mainPhone,
    districtName,
    nces,
    isSysGenNces,
    banner,
    deactivateReason,
    adminActiveStatus,
    isUniversity,
    status
  }
}`;

export const distictQuery = gql`
query($keyword:String!,$state:String!){
  findDistrictsByStateAndKeyword(keyword:$keyword,state:$state){
    districtname,
    id
  }
}`;

export const schoolValidationQuery = gql`
mutation schoolValidation($input:SchoolValidationInput!){
  schoolValidation(schoolValidationInput:$input){
    validation_status
    validation_message
  }
}`;

// Soucs Admin: Get State and city using zip code
export const getStateAndCityUsingZipCode = gql`
mutation($zip:Float!){
  getStateAndCityByAdmin(stateCityInput: {
    zip: $zip
  }){
    state_name
    state_id
    city
  }
}`;

// Get system generated nces id.
export const getSysGeneratedNcesQuery = gql`
query($isUniversity:Float!){
  getSystemGeneratedNcesId(isUniversity:$isUniversity){
    nces
  }
}`;

export const resendInviteLinkQuery = gql`
mutation ($schoolId: Float!) {
  resendSchoolAdminInvitationEmail(schoolId: $schoolId) {
    id
    schoolid
  }
}`;

// Get applicable school list to changed among.
export const getAllAssociatedSchoolsQuery = gql`
query {
	getSameAdminSchool {
		id,
		schoolid,
		schoolName,
		schoolAdminName,
		schoolAdminEmail,
		schoolAdminPhone
	}
}`;

// School Admin: switch to new selected school when multiple school assigend.
export const switchToNewSchoolQuery = gql`
query($schoolId:Float!) {
	switchSchoolAdmin(schoolId: $schoolId) {
		user {
			id,
			schoolid,
			name,
			email,
			phone,
			status
		}
		token
	}
}`;

// Soucs Admin:- Mass resend email invitation to school admins with pending status.
export const massResendInvitationMail = gql`
mutation massResendSchoolAdminInvitationEmail(
  $isForAllSchool:Float!,
  $ids:[Float!]!
){
  massResendSchoolAdminInvitationEmail(massResendSchoolAdminInviteEmailInput:{
    isForAllSchool:$isForAllSchool,
    ids:$ids
  }){
		failEmailSendSchoolAdmin {
			school_id,
			school_name,
			name,
			email,
			error
		}
  }
}`;