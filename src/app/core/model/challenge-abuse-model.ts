export interface ChallengeAbuseListData {
  challengeName: string,
  email: string,
  reportedBy: string,
  creation_time: string,
  reason: string
}

export interface ChallengeAbuseReportData {
  reportedOn: string,
  reportedBy: string,
  email: string,
  reason: string
}