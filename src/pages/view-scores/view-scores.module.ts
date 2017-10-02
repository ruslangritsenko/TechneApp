import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ViewScoresPage } from './view-scores';

@NgModule({
  declarations: [
    ViewScoresPage,
  ],
  imports: [
    IonicPageModule.forChild(ViewScoresPage),
  ],
  exports: [
    ViewScoresPage
  ]
})
export class ViewScoresPageModule {}
