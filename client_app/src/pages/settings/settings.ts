import { Component } from '@angular/core';
import { App, ViewController } from 'ionic-angular';
//Providers
import { Config } from '../../providers/config';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {

  storageType: String;
  oStorageType: String;

  constructor(
    public app: App,
    public config: Config,
    public view: ViewController
  ) { }

  ionViewDidLoad() {
    // console.log('Settings Form: Entering ionViewDidLoad');
  }

  ionViewDidEnter() {
    console.log('Settings Form: Entering ionViewDidEnter');
    //Set the browser window title, just because we can
    this.app.setTitle(this.config.appNameShort + ': Settings');
    //Get the current setting for storage type
    this.config.getStorageType().then(res => {
      console.log(`Settings Form: Current storage type: ${res}`);
      this.storageType = res;
      //Keep the original setting as well (for comparison purposes later)
      this.oStorageType = res;
    });
  }

  dismiss() {
    console.log('Settings Form: Canceling');
    //Since the user cancelled, don't return any data to the page
    this.view.dismiss();
  }

  save() {
    console.log('Settings Form: Saving');
    if (this.oStorageType === this.storageType) {
      console.log('Settings Form: Storage type unchanged');
      //Otherwise return nothing to the calling page
      this.view.dismiss();
    } else {
      console.log(`Settings Form: Storage type changed to ${this.storageType}`);
      //Return the new value to the calling page
      this.view.dismiss(this.storageType);
    }
  }

}
