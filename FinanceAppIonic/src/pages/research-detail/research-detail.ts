import { Component } from '@angular/core';
import { App, ModalController, NavController, NavParams } from 'ionic-angular';
//Form
import { AlertForm } from '../alert-form/alert-form';
//Providers
import { ClientData } from '../../providers/client-data';
import { Config } from '../../providers/config';
import { StockService } from '../../providers/stock-service';

@Component({
  selector: 'page-research-detail',
  templateUrl: 'research-detail.html'
})
export class ResearchDetailPage {

  selectedSegment = 'details';
  //Stock object passed to the page
  stock: any;
  //Stock pricing information retrieved from the service
  stockData: any = {};
  stockNews: any = [];

  constructor(
    // public alertForm: AlertForm,
    public app: App,
    public clientData: ClientData,
    public config: Config,
    public modalCtrl: ModalController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public stocks: StockService
  ) {
    //Pull the stock object off of the parameter stack
    this.stock = navParams.get('stock');
  }

  ionViewDidLoad() {
    // console.log('Stock Details: Entering ionViewDidLoad');
  }

  ionViewDidEnter() {
    this.app.setTitle(this.config.appNameShort + ': Stock Detail');
    if (this.stock) {
      //Populate the Quote page with information about the selected stock
      console.log('Stock Details: getting stock information');
      this.stocks.stockQuote(this.stock.Symbol).then(data => {
        this.stockData = data;
      });
      //Populate the news page with news for the stock
      this.stocks.stockNews(this.stock.Symbol).then(data => {
        this.stockNews = data.value;
      });
    }
  }

  addAlert() {
    console.log('Research Details: addAlert');
    //Create the alert form in a modal dialog
    //We can't create an alert without a symbol (artificial app constraint)
    //So make an alert object
    let alert: any = {};
    //and populate it with the symbol & stock name
    alert.symbol = this.stock.Symbol;
    alert.stockName = this.stock.Name;
    //Pass the new alert object to the form
    let alertModal = this.modalCtrl.create(AlertForm, { alert: alert });
    //display the modal form
    alertModal.present();
    //Do something with the returned data
    alertModal.onDidDismiss(data => {
      console.log('Research Details: AlertForm modal dismissed');
      if (data) {
        //Process updated data
        this.clientData.provider.addAlert(data).then(res => {
          console.log('Research Details: Alert added');
        });
      } else {
        //The user must have cancelled
        console.log('Research Details: No data returned from modal');
      }
    });
  }

  viewNews(item: any) {
    console.log('Opening news item');
    window.open(item.url, "_blank", "hardwareback=no");
  }

}
