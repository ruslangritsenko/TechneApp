import { Component } from '@angular/core';
import { Http } from '@angular/http';
import { NavController, NavParams, Events, MenuController } from 'ionic-angular';

import { Global } from '../config/global';
import { HomePage } from '../home/home';
import { ForgotPasswordPage } from '../forgot-password/forgot-password';

/**
 * Generated class for the SigninPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-signin',
  templateUrl: 'signin.html',
})
export class SigninPage {

    credentials = {};
    emailvalid: boolean;
    passvalid: boolean;
    errtxt: string;
    constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, public events: Events, public menuCtrl: MenuController) {
        this.emailvalid = true;
        this.passvalid = true;
        this.menuCtrl.enable(false);
    }

    ionViewDidLoad() {
    }

    signin(){
        console.log("singin");
        this.errtxt = '';
        if(this.credentials['username'] && this.credentials['password']){
            if (/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(this.credentials['username'])){
                this.http.post(Global.server_url + '/api/auth/signin', this.credentials).subscribe( data => {
                    Global.authentication['user'] = JSON.parse(data['_body']);
                    this.events.publish('user:signin');
                    this.navCtrl.setRoot(HomePage);
                }, err => {
                    err = JSON.parse(err['_body']);
                    this.errtxt = err.message;
                });
            }
        }
    }

    insertEmail(){
        if(this.credentials['username'] == '')
            this.emailvalid = false;
    }

    insertPass(){
        if(this.credentials['password'] == '')
            this.passvalid = false;
    }

    forgotPass(){
        this.navCtrl.push( ForgotPasswordPage );
    }

}
