import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'convertToLocalDate'
})
export class ConvertToLocalDatePipe implements PipeTransform {

  transform(dateString: string): string {      
    const date = Number.isNaN(Date.parse(dateString))?new Date(parseInt(dateString)):new Date(Date.parse(dateString));   
    const newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);   
    const offset = date.getTimezoneOffset() / 60;
    const hours = date.getHours();
    newDate.setHours(hours - offset);
    
    
    return newDate.toLocaleString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
    }

}
