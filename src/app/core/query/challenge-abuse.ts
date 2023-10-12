import { gql } from 'apollo-angular';

/**
 * This API will be used to display challenge abuse report received listing on admin portal
 */
export const getChallengeReportAbuseQuery = gql`
query challengeReportAbuseList($input:ChallengeReportAbuseListInput!){
  challengeReportAbuseList(challengeReportAbuseListInput:$input){
    count
    data{
      challenge_id
      reason
      reported_by
      creation_time,
      status,
      id
    }
    users{
      user_id
      email
      first_name
      last_name
    }
  }
}
`

/**
 * To get all challenges
 */
export const getChallengeByOptionQuery = gql`
{
  getChallengesFromBrightSpotOkta{
      challengeId
       title
       trash
    }
}
`

/**
 * For challenge abuse search by list
 */
export const searchByOptionQuery = gql`
{
  getChallengeAbuseSearchByList{
    options{
      query
      text
    }
  }
}
`

export const getChallengeByIdQuery = gql`
query($id:String!){
  getChallengeByIDBrightSpot(id:$id){
    challengeId,
    title,
    badgeCategory,
    submissionType,
    publishDate,
    challengeType
  }
}`

export const getChallengeReportByIdQuery = gql`
query($id:Float!){
  getChallengeReportAbuseById(id:$id){
    data{
      reported_by
      reason
      creation_time
    }
    user{
      full_name
    }
  }
}`

export const getChallengeReportAbuseDetails = gql`
query challengeReportAbuseDetails($input:ChallengeReportAbuseDetailsInput!){
  challengeReportAbuseDetails(challengeReportAbuseDetailsInput:$input){
    count
    data{
      reason
      reported_by
      creation_time
    }
    users{
      email
      user_id
      first_name
      last_name
    }
  }
}
`