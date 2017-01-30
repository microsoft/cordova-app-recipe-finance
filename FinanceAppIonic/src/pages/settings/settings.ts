import { Component } from '@angular/core';
import { App, ViewController } from 'ionic-angular';
import { Config } from '../../providers/config';

@Component({
    selector: 'page-settings',
    templateUrl: 'settings.html'
})
export class SettingsPage {

    private storageType: String;
    private oStorageType: String;

    constructor(
        public app: App,
        public config: Config,
        public view: ViewController
    ) { }

    ionViewDidLoad() {
        // console.log('Settings Form: Entering ionViewDidLoad');
    }

    ionViewDidEnter() {
        // console.log('Settings Form: Entering ionViewDidEnter');
        //Set the browser window title, just because we can
        this.app.setTitle(this.config.appNameShort + ': Settings');

        //Get the current setting for storage type, and populate the form
        this.config.getStorageType().then(res => {
            console.log(`Settings Form: Current storage type: ${res}`);
            this.storageType = res;
            //Keep the original setting as well (for comparison purposes later)
            this.oStorageType = res;
        });
    }

    dismiss() {
        //Since the user cancelled, don't return any data to the page
        this.view.dismiss();
    }

    save() {
        //Is the storage type the same?
        if (this.oStorageType === this.storageType) {
            //then the user didn't change anything, and we have nothing to do here...
            console.log('Settings Form: Storage type unchanged');
            //return nothing to the calling page
            this.view.dismiss();
        } else {
            //The user did change the storage type, so we have to let the app know...
            console.log(`Settings Form: Storage type changed to ${this.storageType}`);
            //Return the new storage type value to the calling page
            this.view.dismiss(this.storageType);
        }
    }

}
