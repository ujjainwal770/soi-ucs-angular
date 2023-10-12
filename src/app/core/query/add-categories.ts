import { gql } from 'apollo-angular';

export const categoryQuery = gql`
{
  tagcategory{
    id,
    tagcount,
    categoryname
  }
}`;
export const findTagQuey = gql`
  query findTagsByCategoryForAdmin($input:Float!) {
    findTagsByCategoryForAdmin(categoryid:$input){
      id,
      tagname
    }
  }`;

export const addCategoryuery = gql`
mutation addTagCategory($input:AddCategoryInput!){
  addTagCategory(addCategoryInput:$input){
    id,
    categoryname,
    tagcount
  }
}`;
export const removeCategoryQuery = gql`
query deleteTagCategory($input:Float!) {
     deleteTagCategory(id:$input){
       id,
     }
  }`;
export const removeTagsQuery = gql`
mutation removeTag($input:RemoveTagsInput!) {
  removeTag(removeTagInput:$input){
    id,tagname
  }
}`