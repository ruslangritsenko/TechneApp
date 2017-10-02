import { Pipe, PipeTransform } from '@angular/core';
import * as moment from 'moment';

/**
 * Generated class for the SecondsToMsPipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'secondsToMS',
})
export class SecondsToMsPipe implements PipeTransform {
  transform(value: any, ...args: any[]) {
    let duration:any = moment.duration(value, args[0]);
    return this.toClock(duration);
  }
  
  toClock(duration) {
      let value:any;
      let seconds = duration.seconds();
      let minutes = duration.minutes();
      let hours = duration.hours();
      if(seconds < 0){
          value = '0:00';
      }
      else
          value =  hours * 60 + minutes + ":" + this.padder(seconds);
      return value;
  }
  
  padder(value) {
      if(value < 10) {
          return "0" + value;
      } else {
          return value.toString();
      }
  }
}
