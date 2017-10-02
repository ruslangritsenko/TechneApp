import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the AvatarService provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class AvatarService {

    constructor(public http: Http) {
        console.log('Hello AvatarServiceProvider Provider');
    }

    getUrl(avatars, size) {
        if (avatars) {
            for (var i = 0; i < avatars.length; i++) {
                var avatar = avatars[i];
                if (avatar.aspect === '1:1' && avatar.maxWidth === size) {
                  return avatar.url;
                }
            }
        }
        return '/assets/img/default-profile-photo.png';
    }

}
