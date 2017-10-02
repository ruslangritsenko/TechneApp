import { Pipe, PipeTransform } from '@angular/core';

/**
 * Generated class for the HoursToHmPipe pipe.
 *
 * See https://angular.io/docs/ts/latest/guide/pipes.html for more info on
 * Angular Pipes.
 */
@Pipe({
  name: 'hoursToHM',
})
export class HoursToHmPipe implements PipeTransform {
  /**
   * Takes a value and makes it lowercase.
   */
    transform(hours) {
        var intHours = Math.floor(hours);
        return intHours + 'h ' + Math.round((hours - intHours) * 60) + 'm';
    }
}
