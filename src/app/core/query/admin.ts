import { gql } from 'apollo-angular';

// Fetch option list for the filter by status dropdown option
export const fetchAdminStatusQuery = gql`
{
  adminStatusList{
    options{
      text
      query
    }
  }
}`;

// Fetch option list for the filter by status dropdown option
export const adminSearchByListQuery = gql`
{
  adminSearchByList{
    options{
      text
      query
    }
  }
}`;

// Fetch list of all school admin user
export const adminUserListQuery = gql`
query($page:Float!,$keyword:String!,$query:String!,$limit:Float!,$filter:String!,$orderBy:String!, $order:String!){
  adminUserList(oktaAdminListInput:{
    page:$page,
    keyword:$keyword,
    query:$query,
    limit:$limit,
    filter: $filter,
    orderBy: $orderBy,
    order: $order
  }){
    admins{
      fullName,
      email,
      mobilePhone,
      status,
      roleName,
      creationTime,
      created_by_email
    },
    count
  }
}`;


// Deactivate Octa Admin Query
export const deactivateOktaAdminQuery = gql`
mutation($email:String!){
  deactivateOktaAdmin(email:$email){
    firstName, 
    lastName,
    status,
    email,
    userId,
    mobilePhone
  }
}`;

// Reactivate Octa Admin Query
export const reactivateOktaAdmin = gql`
mutation($email:String!){
  reactivateOktaAdmin(email:$email){
    firstName, 
    lastName,
    status,
    email,
    userId,
    mobilePhone
  }
}`;

// Add new Admin user
export const addOktaAdminQuery = gql`
mutation($email:String!, $roleName:String!){
  addOktaAdminUser(
    email: $email,
    roleName: $roleName
  ){
    firstName,
    lastName,
    email,
    roleName,
    mobilePhone
  }
}`;

// List of all admin roles
export const roleQuery = gql`query { 
  role { 
    roleName , 
    status 
  } 
}`;

// SOUCS Admin:- Get status and role using the okta token / email.
export const getRoleByEmailQuery = gql`query{
  getRoleByEmail{
    id,
    roleName,
    status
  }
}`;

// SOUCS admin view profile details
export const soucsAdminProfileDetailQuery = gql`{
  adminUserProfile{
    firstName
    lastName
    email
    roleName
  }
}`;

// School admin view profile details
export const schoolAdminProfileDetailQuery = gql`{
  getMySchoolAdminDetails{
    user{
      name
      email
      phone
    }
    school{
      schoolName
      addressFirst
      addressSecond
      cityName
      stateName
      zipcode
      countryName
      nces
      id 
    }
  }
}`;


// Get octa admin detail by passing its email id
export const getOktaAdminByEmailQuery = gql`
query($email:String!){
  getOktaAdminByEmail(email:$email){
    status,
    mobilePhone,
    firstName,
    lastName,
    email,
    roleName
  }
}`;

// Update octa admin detail based on its email.
export const updateOktaAdminQuery = gql`
mutation($firstName:String!, $lastName:String!, $email: String!, $mobilePhone:String!){
  updateOktaAdmin(updateOktaAdminInput:{
    firstName: $firstName,
    lastName: $lastName,
    email: $email,
    mobilePhone: $mobilePhone
  }){
    firstName,
    lastName,
    email,
    roleName,
    mobilePhone
  }
}`;


export const updateOktaAdminRoleQuery = gql`
mutation($email:String!, $roleName:String!){
  updateOktaAdminRole(updateOktaAdminRoleInput :{
    email:$email,
    roleName:$roleName
  }){
    firstName,
    lastName,
    roleName,
    mobilePhone,
    email  
  }
}`;