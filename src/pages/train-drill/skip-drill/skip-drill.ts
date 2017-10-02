import { Component } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the SkipDrillPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-skip-drill',
  templateUrl: 'skip-drill.html',
})
export class SkipDrillPage {

  currentIndex: any;
  drillGroups: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
    this.currentIndex = this.navParams.get('currentIndex');
    this.drillGroups = this.navParams.get('drillGroups');
    console.log(this.currentIndex);
    console.log(this.drillGroups);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad SkipDrillPage');
  }

  submit(decision) {
    this.viewCtrl.dismiss(decision);
  };

}
