import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavController, NavParams, AlertController } from 'ionic-angular';

import { Global } from '../config/global';

/**
 * Generated class for the ForgotPasswordPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-forgot-password',
  templateUrl: 'forgot-password.html',
})
export class ForgotPasswordPage {

    credentials = {};
    emailvalid: boolean;
    passvalid: boolean;
    errtxt: string;
    constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, public alertCtrl: AlertController) {
        this.emailvalid = true;
        this.passvalid = true;
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ForgotPasswordPage');
    }

    askForPasswordReset() {
        this.http.post(Global.server_url + '/api/auth/forgot', this.credentials ).subscribe( data => {
            this.credentials = {};
            let alert = this.alertCtrl.create({
                subTitle: 'You will receive an email to complete the reset process shortly.',
                buttons: [{
                    text: 'OK',
                    handler: () => {
                        this.navCtrl.pop();
                    }
                }]
            });
            alert.present();
        }, err => {
            this.credentials = {};
            err = JSON.parse(err['_body']);
            this.errtxt = err.message;
            // let alert = this.alertCtrl.create({
            //     subTitle: 'Sorry, we\'re having trouble finding your account. Please contact support@technefutbol.com and provide the following info:\n\n' + this.errtxt,
            //     buttons: ['OK']
            // });
            // alert.present();
        })
    }

    forgotPass() {
        this.navCtrl.pop();
    }

    insertEmail(){
        if(this.credentials['username'] == '')
            this.emailvalid = false;
    }

}
