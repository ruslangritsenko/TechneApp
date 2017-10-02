import { Component, ElementRef } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';

import { Global } from '../../config/global';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer';
import { AvatarService } from '../../../providers/avatar-service/avatar-service';

/**
 * Generated class for the ChangeProfilePicturePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@Component({
  selector: 'page-change-profile-picture',
  templateUrl: 'change-profile-picture.html',
  host: {
    '(document:click)': 'onClick($event)',
  },
  providers: [AvatarService]
})
export class ChangeProfilePicturePage {

    errtxt: string;
    avatar200: string;
    user: any;
    imageDataURL: string;
    isfirst: boolean;
    constructor(public navCtrl: NavController, private _eref: ElementRef, public navParams: NavParams, private camera: Camera, public viewCtrl: ViewController, private transfer: FileTransfer, private avatarService: AvatarService) {
        this.avatar200 = Global.avatar200;
        this.user = Global.authentication['user'];
        this.imageDataURL = null;
        this.isfirst = true;
    }

    ionViewDidLoad() {
        console.log('ionViewDidLoad ChangeProfilePicturePage');
    }

    onClick(event) {
        
        if (!this._eref.nativeElement.contains(event.target) && !this.isfirst){
            this.viewCtrl.dismiss();
        }
        if(this.isfirst == true){
            this.isfirst = false;
        }
    }

    selectImage(){
        const options: CameraOptions = {
            destinationType: this.camera.DestinationType.DATA_URL,
            sourceType: this.camera.PictureSourceType.PHOTOLIBRARY,
            allowEdit: true
        }

        this.camera.getPicture(options).then((imageData) => {
            // imageData is either a base64 encoded string or a file URI
            // If it's base64:
            let base64Image = 'data:image/jpeg;base64,' + imageData;
            this.imageDataURL = base64Image;
        }, (err) => {
            // Handle error
        });
    }

    uploadProfilePicture(){
        const fileTransfer: FileTransferObject = this.transfer.create();
        // let options: FileUploadOptions = {
        //     fileKey: 'file',
        //     fileName: 'name.jpg'
        // }

        fileTransfer.upload(this.imageDataURL, Global.server_url + '/api/user/picture')
        .then((data) => {
            let temp = JSON.parse(data['response']);
            temp = this.avatarService.getUrl(temp.avatars, 200);
            this.viewCtrl.dismiss(temp);
        }, (err) => {
            // error
        });
    }

    cancelUpload(){
        this.viewCtrl.dismiss();
    }

}
