import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the SessionDataProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class SessionData {

  constructor(public http: Http) {
    console.log('Hello SessionDataProvider Provider');
  }

  audioData = {
      Unscored: {
        url: 'unscored',
        length: 77,
      },
      Scored: {
        url: 'scored',
        length: 76,
      },
      'Switch Feet': {
        url: 'switch-feet',
        length: 77,
      },
      'Switch Directions': {
        url: 'switch-directions',
        length: 77,
      },
      'Speed Up': {
        url: 'speed-up',
        length: 72,
      },
    }
    loadAudio() {
      for( var key in this.audioData ) {
        this.audioData[key]['player'] = 'assets/mp3/' + this.audioData[key]['url'] + '.mp3';
      }
    }
}
