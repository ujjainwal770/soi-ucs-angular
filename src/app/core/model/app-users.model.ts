export interface AppUsersData {
    user_id: number,
    account_status: string,
    ucs_status: string,
    first_name: string,
    last_name: string,
    email:string,
    date_of_birth: any,
    country_code: string,
    phone: string,
    schoolverifystatus: string,
    school_id: number,
    school_name:string;
    reportabusecount?: number,
    creation_time:any
  }

  export interface AppUsersTypeData {
    query: string,
    text: string,
  }

  export interface AppUsersReportAbuseInformationData {
    account_status: string,
    date_of_birth: number,
    email: string,
    first_name: string,
    last_name: string,
    phone: string,
    reportabusecount: number
    ucs_status: string,
    user_id: number,
  }

  export interface AppUsersSchoolReportAbuseInformationData {
    addressFirst: string,
    addressSecond: string,
    schoolName: string
  }

  export interface AppReportedUserData {
    first_name: string,
    last_name: string,
    user_id: number
  }

  export interface AppUserSchoolData {
    id: number,
    schoolName: string,
  }