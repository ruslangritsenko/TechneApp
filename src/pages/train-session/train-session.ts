import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import { Http } from '@angular/http';

import { Global } from '../config/global';
import { SessionIntroDialogPage } from './session-intro-dialog/session-intro-dialog';
import { SessionWrapupDialogPage } from './session-wrapup-dialog/session-wrapup-dialog';
import { TrainDrillPage } from '../train-drill/train-drill';
import { HomePage } from '../home/home';
import { SessionData } from '../../providers/session-data/session-data';

/**
 * Generated class for the TrainSessionPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-train-session',
  templateUrl: 'train-session.html',
  providers: [SessionData]
})
export class TrainSessionPage {

  sockLevelCongrats: any;
  authentication: any[] = [];
  currentSectionType: any;
  sessionKey: string;
  session: any[] = [];
  currentDrillGroupIndex: any;
  sessionlength : number;
  constructor(public navCtrl: NavController, public navParams: NavParams, private http: Http, public modalCtrl: ModalController, public SessionData: SessionData) {
    this.sockLevelCongrats = Global.sockLevelCongrats;
    this.authentication['user'] = Global.authentication['user'];
    this.sessionKey = this.navParams.get('sessionKey');
  }

  ionViewDidLoad() {
    console.log(Global.authentication['user']);
    console.log(this.currentSectionType);
    console.log(this.authentication['user']);
    this.sessionlength = this.authentication['user']['sessionProgress']['completions'][this.currentSectionType].length;
  }

  ngOnInit() {
    this.http.get(Global.server_url + '/api/sessions/' + this.sessionKey).subscribe( data => {

      Global.currentSession = JSON.parse(data['_body']);
      var usedSections = 0;
      Global.currentSession['sections'].forEach(value => {
        var sortHash = {},
          idx = 0;
        value.settings.drillScoreOrders.forEach(obj => {
          sortHash[obj.type + ':' + obj.id] = idx;
          idx++;
        });

        value.drills.forEach(drill => {
          var newDg = {
            id: drill.id,
            model: 'drill',
            type: drill.type,
            name: drill.title,
            section_drill: drill.section_drill,
          };
          delete drill.section_drill;
          drill.drill_group_drill = { level: 0 };
          newDg['drills'] = [drill];
          value.drill_groups.push(newDg);
        });

        value.drill_groups.sort(function (a, b) {
          var keyA = ((a.model === 'drill') ? 'd' : 'dg') + ':' + a.id;
          var keyB = ((b.model === 'drill') ? 'd' : 'dg') + ':' + b.id;
          if (sortHash[keyA] < sortHash[keyB]) {
            return -1;
          } else if (sortHash[keyA] > sortHash[keyB]) {
            return 1;
          }
          return 0;
        });

        if (value.drill_groups.length > 0) {
          usedSections++;
        }

        if (value.type === 'Juggling') {
          Global.currentSession['juggling'] = value;
          this.findDefaultDrills(Global.currentSession['juggling']);
        } else if (value.type === 'Dribbling') {
          Global.currentSession['dribbling'] = value;
          this.findDefaultDrills(Global.currentSession['dribbling']);
        } else if (value.type === 'Wall Work') {
          Global.currentSession['wallwork'] = value;
          this.findDefaultDrills(Global.currentSession['wallwork']);
        }
      });
      this.session = Global.currentSession;
      var _that = this;
      this.session['hideSections'] = this.session['name'] && (usedSections === 1);
      if (/*$location.path().indexOf('train') >= 0*/  true) {
        
        if (!Global.authentication['user'].sessionProgress || Global.authentication['user'].sessionProgress.id !== Global.currentSession['id']) {
          this.http.put(Global.server_url + '/api/user/session-mark-drill', { id: Global.currentSession['id'] }).subscribe( result => {
            
            result = JSON.parse(result['_body']);
            Global.authentication['user'].sessionProgress = result['sessionProgress'];
            if (Global.currentSession['juggling'].drill_groups.length > 0) {
              this.setSection('juggling');
            } else if (Global.currentSession['dribbling'].drill_groups.length > 0) {
              this.setSection('dribbling');
            } else if (Global.currentSession['wallwork'].drill_groups.length > 0) {
              this.setSection('wallwork');
            }
            if (Global.currentSession['introUrl'] || Global.currentSession['notes']) {
              let modal = _that.modalCtrl.create(SessionIntroDialogPage, { dialogContent: Global.currentSession['introUrl'] || Global.currentSession['notes'] });
              modal.present();
            }
          });
        } else {
          console.log('setsection '  + Global.authentication['user'].sessionProgress.section);
          this.setSection(Global.authentication['user'].sessionProgress.section);
          if (Global.currentSession['wrapupUrl'] &&
              Global.authentication['user'].sessionProgress.completions.juggling.length === 10 &&
              Global.authentication['user'].sessionProgress.completions.dribbling.length === 10 &&
              Global.authentication['user'].sessionProgress.completions.wallwork.length === 10) {
                let modal = _that.modalCtrl.create(SessionWrapupDialogPage, { dialogContent: Global.currentSession['wrapupUrl'] });
                modal.onDidDismiss(data => {
                  _that.navCtrl.pop();
                });
                modal.present();
          }
        }
      }
    }, err => {
      console.log(err);
    });
  }

  findDefaultDrills(section) {
    section.drill_groups.forEach(drillGroup => {

      drillGroup.drills.sort(function (a, b) {
          if (a.drill_group_drill.level < b.drill_group_drill.level) {
            return -1;
          } else if (a.drill_group_drill.level > b.drill_group_drill.level) {
            return 1;
          }
          return 0;
      });
      drillGroup.defaultDrillIndex = drillGroup.drills.findIndex(function (drill) {
        return drill.drill_group_drill.level === 0;
      });
      if (!drillGroup.defaultDrillIndex) {
        drillGroup.defaultDrillIndex = 0;
      }
    });
  }

  setSection(type) {
    console.log('type ' + type);
    if (Global.authentication['user'].sessionProgress.section === type) {
      this.currentSectionType = type;
    } else {
      Global.authentication['user'].sessionProgress.section = type;
      Global.authentication['user'].sessionProgress.index = 0;
      Global.authentication['user'].sessionProgress.levelIndex = Global.currentSession[Global.authentication['user'].sessionProgress.section].drill_groups[Global.authentication['user'].sessionProgress.index].defaultDrillIndex;
      
      this.http.put(Global.server_url + '/api/user/session-mark-drill', Global.authentication['user'].sessionProgress).subscribe( response => {
        response = JSON.parse(response['_body']);
        Global.authentication['user'].sessionProgress = response['sessionProgress'];
        this.currentSectionType = type;
      });
    }
    this.currentDrillGroupIndex = Global.authentication['user'].sessionProgress.index;
  };

  back() {
    this.navCtrl.setRoot(HomePage);
  }

  startSection() {
    this.SessionData.loadAudio();
    var _this = this;
    var sectionIntroText = Global.currentSession[Global.authentication['user'].sessionProgress.section].intro;
    if (sectionIntroText) {
      let modal = _this.modalCtrl.create(SessionIntroDialogPage, { dialogContent: sectionIntroText });
      modal.onDidDismiss(data => {
        _this.navCtrl.push(TrainDrillPage);
      });
      modal.present();
      // $location.path('drills/' + SessionData.currentSession[Authentication.user.sessionProgress.section].drill_groups[Authentication.user.sessionProgress.index].drills[SessionData.currentSession[Authentication.user.sessionProgress.section].drill_groups[0].defaultDrillIndex].id + '/train');

    }
    _this.navCtrl.push(TrainDrillPage);
    // $location.path('drills/' + SessionData.currentSession[Authentication.user.sessionProgress.section].drill_groups[Authentication.user.sessionProgress.index].drills[SessionData.currentSession[Authentication.user.sessionProgress.section].drill_groups[0].defaultDrillIndex].id + '/train');
  }

  goToDrill(drillGroupIndex, drillGroup, sectionType) {
    var drill = drillGroup.drills[drillGroup.defaultDrillIndex];
    Global.authentication['user'].sessionProgress = {
      id: Global.currentSession['id'],
      section: sectionType,
      index: drillGroupIndex,
      levelIndex: drillGroup.defaultDrillIndex,
    };
    var _that = this;
    this.http.put(Global.server_url + '/api/user/session-mark-drill', Global.authentication['user'].sessionProgress).subscribe( result => {
      this.SessionData.loadAudio();
      console.log(this.SessionData.audioData['Scored']['player']);
      result = JSON.parse(result['_body']);
      Global.authentication['user'].sessionProgress = result['sessionProgress'];
      if (Global.authentication['user'].sessionProgress.completions[Global.authentication['user'].sessionProgress.section].length === 0) {
        var sectionIntroText = Global.currentSession[Global.authentication['user'].sessionProgress.section].intro;
        if (sectionIntroText) {
          let modal = _that.modalCtrl.create(SessionIntroDialogPage, { dialogContent: sectionIntroText });
          modal.onDidDismiss(data => {
            _that.navCtrl.push(TrainDrillPage);
          });
          modal.present();
        }
      }
      _that.navCtrl.push(TrainDrillPage);
    });
  }
}
