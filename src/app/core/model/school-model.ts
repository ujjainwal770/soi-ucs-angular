export interface SchoolData {
    id: number,
    schoolName: string,
    countryName: string,
    stateName: string,
    cityName: string,
    addressFirst: string,
    addressSecond: string,
    zipcode: string,
    schoolProfile: string,
    mainName: string,
    mainEmail: string,
    mainPhone: string,
    creationTime?: string,
    updationTime?: string,
    emailNotificationStatus?: string,
    status?: string,
    districtName:string,
    banner:string,
    nces:string,
    status_text:string;
    deactivateReason:string;
}