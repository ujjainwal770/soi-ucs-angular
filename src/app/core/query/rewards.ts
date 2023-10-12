import { gql } from 'apollo-angular';

// Soucs Admin:- API to fetch the rewards list
export const getAllRewardListQuery = gql`
query(
  $page:Float!, $limit:Float!, $keyword:String!, $filter:String!, 
  $query:String!, $orderBy:String!, $order:String!){
  getAllRewardList(adminRewardListInput:{
    page:$page,
    limit:$limit,
    keyword: $keyword,
    filter: $filter,
    query: $query,
    orderBy: $orderBy,
    order: $order
  }){
    rewards{
      id,
      rewardId,
      title,
      totalUser,
      resultDate,
      closingDate,
      publishDate,
      rewardType,
      tileImage,
      daysLeftForClosing
    },
    count
    currentDate
  }
}`;

// Soucs Admin:- API to fetch the rewards view details
export const getRewardsDetail = gql`
 query($page:Float!, $limit:Float!, $userId:Float!, $rewardId:Float!){
  rewardDetailsView(adminRewardDetailsInput:{
     page:$page,
     limit:$limit,
     userId: $userId,
     rewardId: $rewardId,
   }){
    rewardDetails{
      id,
      rewardId,
      title,
      publishDate,
      resultDate,
      closingDate,
      description,
      points,
      totalUser,
      tileImage,
      winnerStatus,
      daysLeftForClosing,
      rewardEndingCount,
      status
    }
    users{
      userId
      fullName
      email
      date_of_birth
      schoolName
      reportabusecount
      winnerStatus
      ucs_status
    }
    count
    currentTime
   }
 }`;

// Soucs Admin:-  API to fetch winner list
export const getRewardsWinnerList = gql`
query($page:Float!, $limit:Float!, $orderBy:String!, $order:String!){
  getRewardWinnerList(adminRewardWinnerInput:{
    page:$page,
    limit:$limit,
    orderBy: $orderBy,
    order: $order
  }){
    winner {
      fullName
      rewardId,
      email,
      resultDate,
      schoolName,
      ucs_status,
      title
    }
    count
  }
}`;

// School Admin:- Api to fetch top 10 reward applicants
export const getSchoolTopRewardApplicants= gql`
query{
  schoolRewardApplicantBoard{
    rewardsApplicant{
      userName
      userType
      totalRewardSubmitted
      totalRewardsWon
    }
  }
}`;

// School Admin:- Api to fetch top 10 rewards
export const getSchoolTopRewards = gql`
query{
  schoolRewardsLeaderboard{
    rewards{
      rewardName
      userSubmissionNo
      winnerName
      userType
    }
  }
}`;

// Soucs Admin:- Api to fetch top 10 reward applicants
export const getSoucsTopRewardApplicants = gql`
query{
  soucsRewardApplicantBoard{
    rewardsApplicant{
      userName
      userType
      totalRewardSubmitted
      totalRewardsWon
    }
  }
}`;

// Soucs Admin:- Api to fetch top 10 rewards
export const getSoucsTopRewards = gql`
query{
  soucsRewardsLeaderboard{
    rewards{
      rewardName
      userSubmissionNo
      winnerName
      userType
    }
  }
}`;

// Soucs Admin:- API to fetch the rewards list
export const getArchiveRewardsQuery = gql`
query($page:Float!, $limit:Float!, $keyword:String!, $filter:String!, $query:String!, $orderBy:String!, $order:String!){
  getAllArchivedRewardList(AdminArchivedRewardListInput:{
    page:$page,
    limit:$limit,
    keyword: $keyword,
    filter: $filter,
    query: $query,
    orderBy: $orderBy,
    order: $order
  }){
    rewards{
      id,
      rewardId,
      title,
      totalUser,
      resultDate,
      closingDate,
      publishDate,
      rewardType,
      tileImage
    },
    count
    currentDate
  }
}`;