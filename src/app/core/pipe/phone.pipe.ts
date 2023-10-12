import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'phone'
})
export class PhonePipe implements PipeTransform {

  transform(rawNum: string) {
    let rawNums = rawNum;

    const countryCodeStr = rawNums.slice(0,3);
    const areaCodeStr = rawNums.slice(3,6);
    const midSectionStr = rawNums.slice(6,10);

    return `(${countryCodeStr}) ${areaCodeStr}-${midSectionStr}`
  }

}
