import { gql } from 'apollo-angular';

// Soucs admin:- fetch download link form soucs admin
export const soucsReportDownloadLinkQuery = gql`
mutation($startDate:Float!, $endDate:Float!, $fileType:String!, $reportType:String!, $state:String,$timeZoneOffset:Float! ){
  uploadToAzureBlobForSoucs(schoolReportCreateDTO: {
    startDate: $startDate,
    endDate: $endDate,
    fileType: $fileType,
    reportType: $reportType,
    state: $state,
    timeZoneOffset: $timeZoneOffset,
  }){
    uri,
    readUri,
    uploadStatus
  }
}`;

// School admin:- fetch download link form school admin
export const schoolReportDownloadLinkQuery = gql`
mutation($startDate:Float!, $endDate:Float!, $fileType:String!, $reportType:String!, $schoolid:Float!,$timeZoneOffset:Float!  ){
  uploadToAzureBlobForSchool(schoolReportCreateDTO: {
    startDate: $startDate,
    endDate: $endDate,
    fileType: $fileType,
    reportType: $reportType,
    schoolid: $schoolid,    
    timeZoneOffset: $timeZoneOffset,

  }){
    uri,
    readUri,
    uploadStatus
  }
}`;

export const getStateList = gql`
query($countryname:String!){
  getStateList(countryname:$countryname){
    state {
      name,
      abbreviation
    }
  }
}`;