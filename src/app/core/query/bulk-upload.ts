import { gql } from 'apollo-angular';


// This API will be used to display SOUCS dashboard widgets analytics count

export const studentBulkUploadQuery = gql`
  mutation getBulkUpload($filename:String!,$dataCategory:String!){
    getBulkUpload(userBulkUpdateInput:{
      fileName : $filename,
      dataCategory:$dataCategory
    }){
      blobName,
      loadId
    }
  }
  `;

export const schoolBulkUploadQuery = gql`
mutation getBulkUploadForSchool($filename:String!,$dataCategory:String!){
  getBulkUploadForSchool(userBulkUpdateInput:{
    fileName : $filename,
    dataCategory:$dataCategory
  }){
    blobName,
    loadId
  }
}
`;
export const studentBulkUploadListQuery = gql`
query userBulkUploadList(
  $page:Float!,
  $limit:Float!
){
  userBulkUploadList(userBulkUploadListInput:{
    page:$page,
    limit:$limit
  }){
    count
    data{
        load_id
        file_name
        uploaded_by
        total_count
        correct_count
        error_count
        upload_date
        upload_status
        token_name
        error_token_name,
        upload_status_text,
        upload_by_name
    }
  }
}`;

export const downloadStudentBlobQuery=gql`
mutation downloadFromBlobUsingName($blobname:String!,$filename:String!){
  downloadFromBlobUsingName(
    blobName:$blobname,
    fileName:$filename
  ){
    readUri,
    blobName
  }
}
`
export const schoolBulkUploadListQuery= gql`
query schoolBulkUploadList(
  $page:Float!,
  $limit:Float!
){
  schoolBulkUploadList(userBulkUploadListInput:{
    page:$page,
    limit:$limit
  }){
    count,
    data{
      id,
      load_id,
      file_name,
      total_count,
      correct_count,
      error_count,
      upload_date,
      upload_status,
      correct_count,
      token_name,
      status,
      error_token_name,
      updation_time,
      uploaded_by_email, 
      upload_status_text,
    }
  }
}
`