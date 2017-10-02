import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { Media, MediaObject } from '@ionic-native/media';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { SigninPageModule } from '../pages/signin/signin.module';
import { ForgotPasswordPageModule } from '../pages/forgot-password/forgot-password.module';
import { EditProfilePageModule } from '../pages/edit-profile/edit-profile.module';
import { ViewScoresPageModule } from '../pages/view-scores/view-scores.module';
import { TrainSessionPageModule } from '../pages/train-session/train-session.module';
import { ChangeProfilePicturePageModule } from '../pages/edit-profile/change-profile-picture/change-profile-picture.module';
import { SessionIntroDialogPage } from '../pages/train-session/session-intro-dialog/session-intro-dialog';
import { SessionWrapupDialogPage } from '../pages/train-session/session-wrapup-dialog/session-wrapup-dialog';
import { TrainDrillPage } from '../pages/train-drill/train-drill';
import { LeaderboardPage } from '../pages/leaderboard/leaderboard';
import { SkipDrillPage } from '../pages/train-drill/skip-drill/skip-drill';
import { InfoDialogPage } from '../pages/train-drill/info-dialog/info-dialog'
import { TransitionDialogPage } from '../pages/train-drill/transition-dialog/transition-dialog';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AvatarService } from '../providers/avatar-service/avatar-service';
import { HoursToHmPipe } from '../pipes/hours-to-hm/hours-to-hm'
import { SessionData } from '../providers/session-data/session-data';

import { VgCoreModule} from 'videogular2/core';
import { VgControlsModule } from 'videogular2/controls';
import { VgOverlayPlayModule } from 'videogular2/overlay-play';
import { VgBufferingModule } from 'videogular2/buffering';
import { SecondsToMsPipe } from '../pipes/seconds-to-ms/seconds-to-ms';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    HoursToHmPipe,
    SessionIntroDialogPage,
    SessionWrapupDialogPage,
    TrainDrillPage,
    LeaderboardPage,
    SecondsToMsPipe,
    SkipDrillPage,
    InfoDialogPage,
    TransitionDialogPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    VgCoreModule,
    VgControlsModule,
    VgOverlayPlayModule,
    VgBufferingModule,
    ForgotPasswordPageModule,
    SigninPageModule,
    EditProfilePageModule,
    ViewScoresPageModule,
    TrainSessionPageModule,
    ChangeProfilePicturePageModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ListPage,
    SessionIntroDialogPage,
    SessionWrapupDialogPage,
    TrainDrillPage,
    LeaderboardPage,
    SkipDrillPage,
    InfoDialogPage,
    TransitionDialogPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AvatarService,
    SessionData,
    Media
  ]
})
export class AppModule {}
