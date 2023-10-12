import { gql } from 'apollo-angular';

export const addAdminRoleQuery = gql`
  mutation addRole(
    $roleName: String!,   
    $contentView: String!,   
    $contentUpdate: String!,   
    $contentDelete: String!, 
    $adminlistView: String!,   
    $adminlistUpdate: String!,   
    $adminlistDelete: String!,   
    $schoolView: String!,   
    $schoolUpdate: String!,   
    $schoolDelete: String!,   
    $abuseView: String!,   
    $abuseUpdate: String!,   
    $abuseDelete: String!,
    $dashboardView:String!,
    $roleView:String!,
    $roleUpdate:String!,
    $roleDelete:String!,
  ) {
    addRole(addRoleInput: {
      roleName: $roleName,   
      contentView: $contentView,   
      contentUpdate: $contentUpdate,  
      contentDelete: $contentDelete,
      adminlistView: $adminlistView,   
      adminlistUpdate: $adminlistUpdate,   
      adminlistDelete: $adminlistDelete,   
      schoolView: $schoolView,   
      schoolUpdate: $schoolUpdate,   
      schoolDelete: $schoolDelete,   
      abuseView: $abuseView,   
      abuseUpdate: $abuseUpdate,   
      abuseDelete: $abuseDelete,
      dashboardView:$dashboardView,
      roleView:$roleView,
      roleUpdate:$roleUpdate,
      roleDelete:$roleDelete,
    }) {
      id,
      status
    }
  }
`;

// Get Admin roles for the list
export const getAdminRolesQuery = gql`
query($page:Float!,$limit:Float!,$filter:String!,$orderBy:String!, $order:String!){
  getAdminRoleList(viewRoleListInput:{
    page:$page,
    limit:$limit,
    filter: $filter,
    orderBy: $orderBy,
    order: $order
  }){
    count,
		data {
			roleName,
			count,
			description,
			status
		}
  }
}`

// remove the selected role from the list
export const removeAdminRoleQuery = gql`
mutation($roleName:String!){
  removeRole(roleName: $roleName){
    roleName
  }
}`