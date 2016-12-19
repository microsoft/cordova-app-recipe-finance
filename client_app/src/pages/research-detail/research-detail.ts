import { Component } from '@angular/core';
import { App, NavController, NavParams } from 'ionic-angular';
//Providers
import { ClientData } from '../../providers/client-data';
import { Config } from '../../providers/config';
import { StockService } from '../../providers/stock-service';

@Component({
  selector: 'page-research-detail',
  templateUrl: 'research-detail.html'
})
export class ResearchDetailPage {

  //Stock object passed to the page
  stock: any;
  //Stock pricing information retrieved from the service
  stockData: any = {};  

  constructor(
    public app: App,
    public clientData: ClientData,
    public config: Config,
    public navCtrl: NavController,
    public navParams: NavParams,
    public stocks: StockService
  ) {
    console.log('Research Details: constructor');
    //Pull the stock object off of the parameter stack
    this.stock = navParams.get('stock');
  }

  ionViewDidLoad() {
    // console.log('Stock Details: Entering ionViewDidLoad');
  }

  ionViewDidEnter() {
    console.log('Research Details: Entering ionViewDidEnter');
    this.app.setTitle(this.config.appNameShort + ': Stock Detail');
    if (this.stock) {
      //Populate the page with information about the selected stock
      console.log('Stock Details: getting stock information');
      this.stocks.stockQuote(this.stock.Symbol).then(data => {
        console.dir(data);
        this.stockData = data;
      }, error => {
        console.log('Stock Details: Error obtaining stock quote');
        console.error(error);
        this.stockData = {};
      });
    }
  }

  addAlert() {
    console.log('Research Details: addAlert');

  }
}
