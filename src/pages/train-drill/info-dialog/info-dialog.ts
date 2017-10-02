import { Component, ElementRef } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the InfoDialogPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-info-dialog',
  templateUrl: 'info-dialog.html'
})
export class InfoDialogPage {

  drill: any;
  constructor(public navCtrl: NavController, private _eref: ElementRef, public navParams: NavParams, public viewCtrl: ViewController) {
    this.drill = this.navParams.get('TargetDrill');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InfoDialogPage');
  }

  tapContent() {
    this.viewCtrl.dismiss();
  }

}
