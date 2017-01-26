import { Injectable } from '@angular/core';
import { AlertController } from 'ionic-angular';
import { Headers, Http, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/map';
import { Config } from './config';

/**********************************************************
 * This provider retrieves Stock data and news from the
 * Markit On Demand and Bing News Search services. 
 * 
 **********************************************************/

@Injectable()
export class StockService {
    //Stock information provided by Maerkin On Demand
    //http://dev.markitondemand.com/MODApis/#doc_quote
    private chartURL = 'http://dev.markitondemand.com/Api/v2/InteractiveChart/json?parameters=';
    private lookupURL = 'http://dev.markitondemand.com/MODApis/Api/v2/Lookup/json?input=';
    private newsURL = 'https://api.cognitive.microsoft.com/bing/v5.0/news/search?q=';
    private quoteURL = 'http://dev.markitondemand.com/MODApis/Api/v2/Quote/json?symbol=';

    constructor(
        public alertController: AlertController,
        private config: Config,
        private http: Http
    ) {
        console.log('Initializing Stocks Service Data Provider');
    }

    companyLookup(input: string): Promise<any> {
        console.log(`StockService: companyLookup (${input})`);
        return new Promise(resolve => {
            this.http.get(this.lookupURL + encodeURIComponent(input)).subscribe(data => {
                // console.log(data);
                resolve(data.json());
            }, (error) => {
                //Because of CORS issues, this won't work when serving through the browser
                //has to be tested on a physical device
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
                // console.log(data);
                resolve(data.json());
            }, (error) => {
                //Because of CORS issues, this won't work when serving through the browser
                //has to be tested on a physical device
                console.error(error);
                this.displayError(error);
                resolve({});
            });
        });
    }

    stockNews(input: string): Promise<any> {
        return new Promise(resolve => {
            if (this.config.bingSearchKey) {
                //Build the URL we need to start the search
                let newsURL = this.newsURL + encodeURIComponent(input) + '&safeSearch';
                console.log(newsURL);
                //Pass the API key in the request headers 
                let headers = new Headers({ 'Ocp-Apim-Subscription-Key': this.config.bingSearchKey });
                let options = new RequestOptions({ headers: headers });
                this.http.get(newsURL, options)
                    .subscribe(data => {
                        // console.log(data);
                        resolve(data.json());
                    }, (error) => {
                        //Because of CORS issues, this won't work when serving through the browser
                        //has to be tested on a physical device
                        console.error(error);
                        this.displayError(error);
                        resolve([]);
                    });
            } else {

            }
        });
    }

    getStockData(): Promise<any> {
        return new Promise(resolve => {

        });
    }

    displayError(errorMsg: string) {
        console.log('StockService: Entering displayError');
        let alertDlg = this.alertController.create({
            title: 'Stock Service Error', message: errorMsg, buttons: [{ text: 'OK' }]
        });
        alertDlg.present();
    }

}
