import { Component } from '@angular/core';
import { NavController, AlertController, MenuController } from 'ionic-angular';

import { Global } from '../config/global';
import { AvatarService } from '../../providers/avatar-service/avatar-service';
import { EditProfilePage } from '../edit-profile/edit-profile';
import { ViewScoresPage } from '../view-scores/view-scores';
import { TrainSessionPage } from '../train-session/train-session';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html',
  providers: [AvatarService]
})
export class HomePage {

    authentication: any[] = [];
    avatar200: string;
    confirmEndingTrial: boolean;
    constructor(public navCtrl: NavController, public alertCtrl: AlertController, private avatarService: AvatarService, public menuCtrl: MenuController) {
        this.authentication = Global.authentication;
        if(!Global.avatar200)
            Global.avatar200 = this.avatarService.getUrl(this.authentication['user'].avatars, 200);
        this.avatar200 = Global.avatar200;
        this.menuCtrl.enable(true);
    }

    ionViewDidLoad() {
    }

    ionViewWillEnter() {
        this.avatar200 = Global.avatar200;
    }

    showHelp(){
        let alert = this.alertCtrl.create({
            subTitle: "Your Training Streak is the number<br/>of consecutive days you've trained<br/>for 10 minutes or more.",
            buttons: ['OK']
        });
        alert.present();
    }

    edit() {
        this.navCtrl.push(EditProfilePage);
    }

    startEndTrial() {
        this.confirmEndingTrial = true;
    }

    cancelEndTrial() {
        this.confirmEndingTrial = false;
    }

    endTrial() {
        // User.endTrial({}, {}, function () {
        //     $window.location.href = 'http://www.technefutbol.com/signup.html';
        // })
    }

    viewScores() {
        this.navCtrl.push(ViewScoresPage);
    }

    trainSession() {
        this.navCtrl.push(TrainSessionPage, {sessionKey: 'current'});
    }

}
