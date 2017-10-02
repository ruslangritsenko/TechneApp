import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ChangeProfilePicturePage } from './change-profile-picture';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';

@NgModule({
  declarations: [
    ChangeProfilePicturePage
  ],
  imports: [
    IonicPageModule.forChild(ChangeProfilePicturePage),
  ],
  exports: [
    ChangeProfilePicturePage
  ],
  providers: [
    Camera,
    FileTransfer,
    FileTransferObject
  ]
})
export class ChangeProfilePicturePageModule {}
