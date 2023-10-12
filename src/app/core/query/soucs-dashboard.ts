import { gql } from 'apollo-angular';

/**
 * This API will be used to display SOUCS dashboard widgets analytics count
 */
export const soucsUserCountQuery = gql`
{
  SoucsUserCountAnalytics{
    totalschools,
    totalactiveschools,
    totalusers,
    totalucsusers,
    totalguestusers
  }
}
`;

export const soucsDashboardLeaderboardQuery = gql`{
  soucsDashboardLeaderboard{
    topschool{
      id,
      schoolName,
      stateName,
      cityName,
      totalpoints
    }
    topucsusers{
      user_id,
      first_name,
      last_name,
      stateName,
      school_id,
      totalpoints
    }
    topguestusers{
      user_id,
      first_name,
      last_name,
      stateName,
      cityName,
      totalpoints
    }
    ucsschools{
            id,
      schoolName
    }
  }
}`

export const soucsMonthlyRegQuery= gql`
query monthalyRegistrationSoucs($input:Float!){
  monthalyRegistrationSoucs(year:$input){
    month,
    ucs,
    public
  }
}`;


export const soucsBadgesQuery = gql `
{
  InclusionBadgeSoucsDashboard{
    badge,
    count,
    percent
  }
}`;

export const soucsChallengeIDQuery = gql `
{
  topChallegesPlayedByAll{
    challenge_id,
    count
  }
}`;
export const soucsChallengeTitleQuery = gql `
{
  getChallengesFromBrightSpotOkta{
      challengeId
      title
      badgeCategory
    }
}`;
