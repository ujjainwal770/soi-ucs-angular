import { gql } from 'apollo-angular';

/**
 * This API will be used to display SOUCS dashboard widgets analytics count
 */
export const schoolUSerCountQuery = gql`
{
  getSchoolStudentCount{
    total_student_count,
    pending_student_count
  }
}
`;

export const schoolMonthlyRegQuery= gql`
query monthalyRegistrationSchool($input:Float!){
  monthalyRegistrationSchool(year:$input){
    month,
    ucs,
    public
  }
}`;

export const schoolDashboardLeaderboardQuery = gql`{
  schoolAdminDashboardLeaderboard{
    topusers{
      user_id,
      school_id,
      full_name,
      email,
      stateName
      totalpoints
    },
    topschool{
      schools{
        id,
        schoolName,
        stateName,
        cityName
        totalpoints
      },
      rank
    }
  }
}`;

export const schoolChallengeIDQuery = gql `
{
  topChallegesPlayedBySchool{
    count,
    challenge_id
  }
}`;

export const schoolChallengeTitleQuery = gql `
{
  getChallengesFromBrightSpotOktaForSchool{
      challengeId
      title
      badgeCategory
    }
}`;

export const schoolBadgesQuery = gql `
{
  InclusionBadgeSchoolDashboard{
    count,
    badge,
    percent
  }
}`;
