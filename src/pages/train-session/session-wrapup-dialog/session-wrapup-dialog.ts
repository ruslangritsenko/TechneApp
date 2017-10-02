import { Component, ElementRef } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

/**
 * Generated class for the SessionWrapupDialogPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-session-wrapup-dialog',
  templateUrl: 'session-wrapup-dialog.html',
  host: {
    '(document:click)': 'onClick($event)',
  }
})
export class SessionWrapupDialogPage {

  dialogContent: any;
  content: any;
  contentUrl: any;
  isfirst: boolean;
  constructor(public navCtrl: NavController, private _eref: ElementRef, public navParams: NavParams, public viewCtrl: ViewController) {
    this.dialogContent = navParams.get('dialogContent');
    this.isfirst = true;
    if (this.dialogContent.indexOf(' ') >= 0) {
      this.content = this.dialogContent;
    } else {
      console.log(this.dialogContent);
      this.contentUrl = 'http:' + this.dialogContent;
    }

  }

  onClick(event) {
        
    if (!this._eref.nativeElement .contains(event.target) && !this.isfirst){
      this.viewCtrl.dismiss();
    }
    if(this.isfirst == true){
      this.isfirst = false;
    }
  }

  submit() {
    this.viewCtrl.dismiss();
  }
}
