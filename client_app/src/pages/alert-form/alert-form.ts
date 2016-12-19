import { Component } from '@angular/core';
import { App, NavController, NavParams, ViewController } from 'ionic-angular';
//Providers
import { Config } from '../../providers/config';

@Component({
  selector: 'page-alert-form',
  templateUrl: 'alert-form.html'
})
export class AlertForm {

  alert: any = {};

  constructor(
    public app: App,
    public config: Config,
    public navCtrl: NavController,
    navParams: NavParams,
    public view: ViewController
  ) { }

  ionViewDidLoad() {
    // console.log('Alert Form: Entering ionViewDidLoad');
  }

  ionViewDidEnter() {
    console.log('Alert Form: Entering ionViewDidEnter');
    //Set the window title for the browser, just because we can     
    this.app.setTitle(this.config.appNameShort + ': Alert');
  }

  dismiss() {
    console.log('Alert Form: Canceling');
    //Since the user cancelled, don't return any data to the page
    this.view.dismiss();
  }

  save() {
    console.log('Alert Form: Saving');
    //Return the form's data (the account object) to the page
    this.view.dismiss(this.alert);
  }
  
}
