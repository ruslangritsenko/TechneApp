import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, Events, MenuController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Http } from '@angular/http';

import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { SigninPage } from '../pages/signin/signin';
import { EditProfilePage } from '../pages/edit-profile/edit-profile';
import { TrainSessionPage } from '../pages/train-session/train-session';
import { LeaderboardPage } from '../pages/leaderboard/leaderboard';
import { Global } from '../pages/config/global';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = SigninPage;

  groupId: any;

  groupSessions: any[] = [];

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, private http: Http, public events: Events, public menuCtrl: MenuController) {
    this.initializeApp();
    
    this.events.subscribe('user:signin', () => {
      if(Global.authentication['user']){
        this.groupId = Global.authentication['user'].groupId;
      }

      if (this.groupId) {
        this.http.get(Global.server_url + '/api/group-sessions').subscribe( data => {
          this.groupSessions = JSON.parse(data['_body']);
        });
      }
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    if(page == 'profile'){
      this.nav.setRoot(HomePage);
    }
    else if(page == 'weeklysession'){
      this.nav.setRoot(TrainSessionPage, {sessionKey: 'current'});
    }
    else if(page == 'leaderboard'){
      this.nav.setRoot(LeaderboardPage);
    }
    else if(page == 'logout'){
      this.menuCtrl.enable(false);
      Global.avatar200 = null;
      Global.authentication = [];
      this.groupId = null;
      this.groupSessions = [];
      this.nav.setRoot(SigninPage);
    }
  }

  openSession(gs){
    this.nav.setRoot(TrainSessionPage,{
      sessionKey: 'gs:' + gs.id
    });
  }

  openGroup(groupId) {
    this.nav.setRoot(LeaderboardPage, {
      groupId: groupId
    });
  }
}
