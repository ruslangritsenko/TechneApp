import { Component } from '@angular/core';
import { NavController, NavParams, Platform, ModalController } from 'ionic-angular';
import { FormControl } from '@angular/forms';
import { Http } from '@angular/http';

import { Global } from '../config/global';
import { SessionData } from '../../providers/session-data/session-data';
import { HomePage } from '../home/home';
import { Media, MediaObject } from '@ionic-native/media';
import { Observable } from 'rxjs/Rx';
import { TransitionDialogPage } from './transition-dialog/transition-dialog';
import { InfoDialogPage } from './info-dialog/info-dialog';
import { SkipDrillPage } from './skip-drill/skip-drill';

/**
 * Generated class for the TrainDrillPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-train-drill',
  templateUrl: 'train-drill.html',
  providers: [SessionData]
})
export class TrainDrillPage {

  sockLevelCongrats: any;
  authentication: any[] = [];
  playerConfig = {
    preload: 'none',
    autoPlay: true,
    theme: '/lib/videogular-themes-default/videogular.css',
    plugins: {
      controls: {
        autoHide: true,
        autoHideTime: 5000,
      },
    },
  };
  drillProgress = { width: 0 + '%' };
  drillOptions : any[] = [];
  drillOptionIndex: any;
  drill: any;
  currentSectionType: string;
  inProgress: boolean;
  drillaudio: MediaObject;
  timer: any;
  currentTime = 0;
  maxSlide: number;
  audioStatus: number;
  seekbar:FormControl = new FormControl();

  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, private SessionData: SessionData, private media: Media, private platform: Platform, public modalCtrl: ModalController) {
    if (Global.sockLevelCongrats) {
      this.sockLevelCongrats = Global.sockLevelCongrats;
      delete Global.sockLevelCongrats;
    }
    
    this.authentication = Global.authentication;

    // $scope.title = $stateParams.title;

    if (!Global || !Global.currentSession) {
      this.navCtrl.pop();
    }

    this.drillOptions = Global.currentSession[Global.authentication['user'].sessionProgress.section].drill_groups[Global.authentication['user'].sessionProgress.index].drills;
    this.drillOptionIndex = Global.authentication['user'].sessionProgress.levelIndex;
    this.drill = this.drillOptions[this.drillOptionIndex];
    this.SessionData.loadAudio();
    this.playerConfig['src'] = "http:" + this.drill.videoURL;

    if (Global.currentSession.hideSections) {
      this.currentSectionType = Global.currentSession.name;
    } else {
      this.currentSectionType = ({ juggling: 'Juggling', dribbling: 'Dribbling', wallwork: 'Wall Work' })[Global.authentication['user'].sessionProgress.section];
    }
    console.log('constructor end');
  }

  ionViewDidLoad() {
    this.inProgress = false;
    if(this.platform.is('android')){
      this.drillaudio = this.media.create('/android_asset/www/' + this.SessionData.audioData[this.drill.audioType].player);
    }
    else{
      this.drillaudio = this.media.create(this.SessionData.audioData[this.drill.audioType].player);
    }
    this.drillaudio.onStatusUpdate.subscribe(status => this.audioStatus = status);
    this.maxSlide = this.SessionData.audioData[this.drill.audioType].length;
  }

  skipToNextDrill(decision, index?) {
    index = parseInt(index);
    var currentSection = Global.currentSession[Global.authentication['user'].sessionProgress.section];
    var _this = this;
    if (index || Global.authentication['user'].sessionProgress.index < (currentSection.drill_groups.length - 1)) {
      if (index) {
        Global.authentication['user'].sessionProgress.index = index;
      } else if (decision !== 'repeat') {
        Global.authentication['user'].sessionProgress.index++;
      }
      Global.authentication['user'].sessionProgress.levelIndex = currentSection.drill_groups[Global.authentication['user'].sessionProgress.index].defaultDrillIndex;

      return this.http.put(Global.server_url + '/api/user/session-mark-drill', Global.authentication['user'].sessionProgress).subscribe(function (response) {
        response = JSON.parse(response['_body']);
        Global.authentication['user'].sessionProgress = response['sessionProgress'];
        if (decision === 'repeat') {
          _this.restartDrill();
        }
        //
        else _this.navCtrl.push(TrainDrillPage);
        // return $location.path('drills/' + currentSection.drill_groups[Authentication.user.sessionProgress.index].drills[Authentication.user.sessionProgress.levelIndex].id + '/train');
      });
    }
    Global.authentication['user'].sessionProgress.index = 0;
    Global.authentication['user'].sessionProgress.levelIndex = currentSection.drill_groups[Global.authentication['user'].sessionProgress.index].defaultDrillIndex;

    return this.http.put(Global.server_url + '/api/user/session-mark-drill', Global.authentication['user'].sessionProgress).subscribe(function (response) {

      response = JSON.parse(response['_body']);
      Global.authentication['user'].sessionProgress = response['sessionProgress'];
      if (('' + Global.currentSession['id']).indexOf('gs:') === 0) {
        //
        _this.navCtrl.push(TrainDrillPage);
        // return $location.path('sessions/' + SessionData.currentSession.id + '/train');
      }
      //
        _this.navCtrl.push(TrainDrillPage);
      // return $location.path('sessions/current/train');
    });
  }

  back() {
    this.navCtrl.setRoot(HomePage);
    this.drillaudio.stop();
    this.timer.unsubscribe();
  }

  sockLevelCongratsFunc(hoursLogged) {
    if ([10, 25, 50, 75, 100, 250, 500, 1000].indexOf(hoursLogged) >= 0) {
      return 'Congratulations ' + Global.authentication['user'].firstName + '! ' + hoursLogged + ' Hours';
    }
    return null;
  }

  

  startDrill() {
    if (!this.inProgress) {
      this.drillaudio.play();
      this.inProgress = true;
      // Get duration
      var counter = 0;
      var _that = this;
      // var timerDur = setInterval(function() {
      //     counter = counter + 100;
      //     if (counter > 2000) {
      //         clearInterval(timerDur);
      //     }
      //     var dur = _that.drillaudio.getDuration();
      //     if (dur > 0) {
      //         clearInterval(timerDur);
      //         _that.maxSlide = dur;
      //     }
      // }, 100);
      // Get Current Position
      let observable = Observable.interval(1000);
      this.timer = observable.subscribe(() =>{
          if(this.audioStatus != 3){
            this.drillaudio.getCurrentPosition()
            .then(value => {
                this.currentTime = value;
                this.drillProgress = { width: (this.currentTime / this.maxSlide * 100) + '%' };
                
            });
          }

          if(this.currentTime < 0 && this.audioStatus == 4){
            this.timer.unsubscribe();
            let modal = this.modalCtrl.create(TransitionDialogPage);
            modal.onDidDismiss(decision => {
              this.http.put(Global.server_url + '/api/user/log-minute', Global.authentication['user']).subscribe( response => {
                response = JSON.parse(response['_body']);
                Global.authentication['user'].sessionProgress = response['sessionProgress'];
                Global.authentication['user'].currentTrainingStreak = response['currentTrainingStreak'];
                Global.authentication['user'].bestTrainingStreak = response['bestTrainingStreak'];
                Global.authentication['user'].hoursLogged = response['hoursLogged'];
                Global.authentication['user'].weeklyHoursLogged = response['weeklyHoursLogged'];
                Global.sockLevelCongrats = this.sockLevelCongratsFunc(parseFloat(response['hoursLogged']));
                this.skipToNextDrill(decision);
              });
            });
            modal.present();
          }
      });
      
    }
  }

  restartDrill() {
    if (this.inProgress) {
      this.inProgress = false;
      this.drillaudio.stop();
      this.timer.unsubscribe();
      this.drillProgress = { width: '0%' };
      this.currentTime = 0;
    }
  }

  skipDrill(event) {
    var currentSection = Global.currentSession[Global.authentication['user'].sessionProgress.section];
    if(this.drillaudio){
      this.drillaudio.pause();
    }
    let modal = this.modalCtrl.create(SkipDrillPage, {
      currentIndex: Global.authentication['user'].sessionProgress.index,
      drillGroups: currentSection.drill_groups,
    });
    modal.onDidDismiss(newDrillGroupIndex => {
      if (newDrillGroupIndex >= 0) {
        this.skipToNextDrill('goto', newDrillGroupIndex);
      } else if (this.inProgress) {
        
        this.drillaudio.play();
        this.timer.play();
      }
    });
    modal.present();
  }

  levelUp() {
    if (this.drillaudio) {
      this.drillaudio.stop();
    }
    Global.authentication['user'].sessionProgress.levelIndex++;
    var _that = this;
    this.http.put(Global.server_url + '/api/user/session-mark-drill', Global.authentication['user'].sessionProgress).subscribe( response => {
      response = JSON.parse(response['_body']);
      Global.authentication['user'].sessionProgress = response['sessionProgress'];
      //
        _that.navCtrl.push(TrainDrillPage);
      // $location.path('drills/' + SessionData.currentSession[Authentication.user.sessionProgress.section].drill_groups[Authentication.user.sessionProgress.index].drills[Authentication.user.sessionProgress.levelIndex].id + '/train');
    });
  }

  levelDown() {
    if (this.drillaudio) {
      this.drillaudio.stop();
    }
    Global.authentication['user'].sessionProgress.levelIndex--;
    var _that = this;
    this.http.put(Global.server_url + '/api/user/session-mark-drill', Global.authentication['user'].sessionProgress).subscribe(response => {
      response = JSON.parse(response['_body']);
      Global.authentication['user'].sessionProgress = response['sessionProgress'];
      //
        _that.navCtrl.push(TrainDrillPage);
      // $location.path('drills/' + SessionData.currentSession[Authentication.user.sessionProgress.section].drill_groups[Authentication.user.sessionProgress.index].drills[Authentication.user.sessionProgress.levelIndex].id + '/train');
    });
  }

  showInfo() {
    let modal = this.modalCtrl.create(InfoDialogPage, {
      TargetDrill: this.drill
    });
    modal.present();
  }


  endSection() {
    if (this.inProgress) {
      this.drillaudio.stop();
      this.timer.unsubscribe();
      this.drillProgress = { width: '0%' };
      this.currentTime = 0;
      this.inProgress = false;
    }
    this.navCtrl.setRoot(HomePage);
  }

}
