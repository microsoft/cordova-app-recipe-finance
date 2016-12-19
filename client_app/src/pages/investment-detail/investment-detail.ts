import { Component } from '@angular/core';
import { App, NavController, NavParams } from 'ionic-angular';
//Providers
import { ClientData } from '../../providers/client-data';
import { Config } from '../../providers/config';

@Component({
  selector: 'page-investment-detail',
  templateUrl: 'investment-detail.html'
})
export class InvestmentDetail {

  investment: any = {};

  constructor(
    public app: App,
    public clientData: ClientData,
    public config: Config,
    public navCtrl: NavController,
    public navParams: NavParams,
  ) {
    this.investment = navParams.get('investment');
  }

  ionViewDidLoad() {
    //  console.log('Investment Detail: Entering ionViewDidEnter');
  }

  ionViewDidEnter() {
    console.log('Investment Detail: Entering ionViewDidEnter');
    this.app.setTitle(this.config.appNameShort + `: ${this.investment.symbol}`);
  }


}
