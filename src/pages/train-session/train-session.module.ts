import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TrainSessionPage } from './train-session';

@NgModule({
  declarations: [
    TrainSessionPage,
  ],
  imports: [
    IonicPageModule.forChild(TrainSessionPage),
  ],
  exports: [
    TrainSessionPage
  ]
})
export class TrainSessionPageModule {}
