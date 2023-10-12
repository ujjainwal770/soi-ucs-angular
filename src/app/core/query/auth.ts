/**
 * This file can be used to define all the queries related to authorization
 * e.g. login, change-password, forgot-password, set-password etc..
 */
import { gql } from 'apollo-angular';

/**
 * Change Password component:-
 * Query for school admin change password.
 */
export const changeSchoolAdminPasswordQuery = gql`
mutation ChangeSchoolAdminPassword($input:ChangePasswordInput!){
  ChangeSchoolAdminPassword(changePasswordInput:$input){
    schoolid
    name
    email
  }
}`


/**
 * Forgot Password component:-
 * Query to generate and send the verificaiton link for the 'school admin forgot password'.
 */
 export const forgotPasswordVerificationLinkQuery = gql`
 mutation generateForgotPasswordVerificationLink($input:ForgotPasswordInput!){
  generateForgotPasswordVerificationLink(forgotPasswordInput:$input){
    email
  }
}`