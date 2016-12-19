import { Component } from '@angular/core';
import { App, NavController, NavParams } from 'ionic-angular';
import { Config } from '../../providers/config';

@Component({
  selector: 'page-alert-detail',
  templateUrl: 'alert-detail.html'
})
export class AlertDetail {

  alert: any = {};

  constructor(
    public app: App,
    public config: Config,
    public navCtrl: NavController,
    public navParams: NavParams,
  ) {
    this.alert = navParams.get('alert');
  }

  ionViewDidLoad() {
    //  console.log('Alert Detail: Entering ionViewDidEnter');
  }

  ionViewDidEnter() {
    console.log('Alert Detail: Entering ionViewDidEnter');
    this.app.setTitle(this.config.appNameShort + ': Alert');
  }

}
