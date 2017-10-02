import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';

import { Global } from '../config/global';

/**
 * Generated class for the ViewScoresPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-view-scores',
  templateUrl: 'view-scores.html',
})
export class ViewScoresPage {

  juggling: any[] = [];
  dribbling: any[] = [];
  wallwork: any[] = [];
  errtxt: string;
  currentSectionType: string;
  pet: string = "puppies";
  
  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http) {
    this.juggling = [];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ViewScoresPage');
  }

  ngOnInit() {
    this.setSection('juggling');
    this.juggling = [];
    this.dribbling = [];
    this.wallwork = [];

    var sortByScoreOrder = function (array) {
      array.sort(function (a, b) {
        if (a.scoreOrder < b.scoreOrder) {
          return -1;
        } else if (a.scoreOrder > b.scoreOrder) {
          return 1;
        }
        return 0;
      });
    };

    this.http.get(Global.server_url + '/api/drill-logs').subscribe( data => {
      let temp = JSON.parse(data['_body']);
      temp.forEach(drillLog => {
        drillLog['drill_logs'].sort(function (a, b) {
          var points = {
            a: parseFloat(a.points),
            b: parseFloat(b.points),
          };
          if (points.a < points.b) {
            return 1;
          } else if (points.a > points.b) {
            return -1;
          }
          return 0;
        });

        if (drillLog.drill_logs.length > 0) {
          drillLog.points = drillLog.drill_logs[0].points;
        }
        if (drillLog.type === 'Juggling') {
          this.juggling.push(drillLog);
        } else if (drillLog.type === 'Dribbling') {
          this.dribbling.push(drillLog);
        } else if (drillLog.type === 'Wall Work') {
          this.wallwork.push(drillLog);
        }
      });
      sortByScoreOrder(this.juggling);
      sortByScoreOrder(this.dribbling);
      sortByScoreOrder(this.wallwork);
    }, err => {
      console.log(err);
      err = JSON.parse(err['_body']);
      this.errtxt = err.message;
    });

  }

  back() {
    this.navCtrl.pop();
  }

  //   DrillLogs.query(function (drillLogs) {
  //     angular.forEach(drillLogs, function (drillLog) {
  //       drillLog.drill_logs.sort(function (a, b) {
  //         var points = {
  //           a: parseFloat(a.points, 10),
  //           b: parseFloat(b.points, 10),
  //         };
  //         if (points.a < points.b) {
  //           return 1;
  //         } else if (points.a > points.b) {
  //           return -1;
  //         }
  //         return 0;
  //       });
  //       if (drillLog.drill_logs.length > 0) {
  //         drillLog.points = drillLog.drill_logs[0].points;
  //       }
  //       if (drillLog.type === 'Juggling') {
  //         this.juggling.push(drillLog);
  //       } else if (drillLog.type === 'Dribbling') {
  //         this.dribbling.push(drillLog);
  //       } else if (drillLog.type === 'Wall Work') {
  //         this.wallwork.push(drillLog);
  //       }
  //     });
  //     sortByScoreOrder(this.juggling);
  //     sortByScoreOrder(this.dribbling);
  //     sortByScoreOrder(this.wallwork);
  //   });
  // }

  setSection(type) {
    Global.currentSectionType = type;
    this.currentSectionType = Global.currentSectionType;
  };

}
