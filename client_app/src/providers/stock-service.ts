import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';


@Injectable()
export class StockService {
  //Stock information provided by Maerkin On Demand
  //http://dev.markitondemand.com/MODApis/#doc_quote
  private lookupURL = 'http://dev.markitondemand.com/MODApis/Api/v2/Lookup/json?input=';
  private quoteURL = 'http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=';
  // private chartURL = 'http://dev.markitondemand.com/Api/v2/InteractiveChart/json?parameters=';

  constructor(
    public alertController: AlertController,
    private http: Http
  ) {
    console.log('Initializing Stocks Service Data Provider');
  }

  companyLookup(input: string): Promise<any> {
    console.log(`StockService: companyLookup (${input})`);
    return new Promise(resolve => {
      this.http.get(this.lookupURL + encodeURIComponent(input)).subscribe(data => {
        console.log(data);
        resolve(data.json());
      }, (error) => {
        console.error(error);
        this.displayError(error);
        resolve([]);
      });
    });
  }

  stockQuote(input: string): Promise<any> {
    console.log('StockService: stockQuote');
    return new Promise(resolve => {
      this.http.get(this.quoteURL + encodeURIComponent(input)).subscribe(data => {
        console.log(data);
        resolve(data.json());
      }, (error) => {
        console.error(error);
        this.displayError(error);
        resolve([]);
      });
    });
  }

  // getStockData(): Promise<any> {

  // }

  displayError(errorMsg: string) {
    let alertDlg = this.alertController.create({
      title: 'Stock Service Error', message: errorMsg, buttons: [{ text: 'OK' }]
    });
    alertDlg.present();
  }

}
