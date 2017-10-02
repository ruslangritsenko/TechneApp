import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { Global } from '../../config/global';
import { Http } from '@angular/http';
/**
 * Generated class for the TransitionDialogPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-transition-dialog',
  templateUrl: 'transition-dialog.html',
})
export class TransitionDialogPage {

  currentDrill: any;
  points: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController, private http: Http) {
    var progress = Global.authentication['user'].sessionProgress;
    this.currentDrill = Global.currentSession[progress.section].drill_groups[progress.index].drills[progress.levelIndex];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TransitionDialogPage');
  }

  submit(decision) {
    this.http.post(Global.server_url + '/api/drill-logs', {
      points: parseFloat(this.points || 0),
      drillId: this.currentDrill.id,
    }).subscribe( data => {
      this.viewCtrl.dismiss(decision);
    }, err => {

    });
    // var drillLog = new DrillLogs({
    //   points: parseFloat($scope.points || 0, 10),
    //   drillId: $scope.currentDrill.id,
    // });
    // drillLog.$save(function () {
    //   $mdDialog.hide(decision);
    // }, function (errorResponse) {
    //   $scope.error = errorResponse.data.message;
    // });
    // console.log(this.currentDrill.id);

  }

  getCurrentSectionType() {
    if (Global.currentSession.hideSections) {
      return Global.currentSession.name;
    }
    return ({ juggling: 'Juggling', dribbling: 'Dribbling', wallwork: 'Wall Work' })[Global.authentication['user'].sessionProgress.section];
  }

}
