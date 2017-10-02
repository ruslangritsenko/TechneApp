import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditProfilePage } from './edit-profile';

import { KeysPipe } from '../../pipes/keys/keys'

@NgModule({
  declarations: [
    EditProfilePage,
    KeysPipe
  ],
  imports: [
    IonicPageModule.forChild(EditProfilePage)
  ],
  exports: [
    EditProfilePage,
    KeysPipe
  ]
})
export class EditProfilePageModule {}
