import { Component } from '@angular/core';
import { AlertController, App, NavParams, ViewController } from 'ionic-angular';
// Providers
import { Config } from '../../providers/config';
import { StockService } from '../../providers/stock-service';

@Component({
    selector: 'page-stock-search',
    templateUrl: 'stock-search.html'
})
export class StockSearch {

    hasSearched: boolean = false;
    hasSearchResults: boolean = false;
    searchStr: string;
    stock: any;
    stockList: Array<any> = [];

    constructor(
        public app: App,
        public config: Config,
        public navParams: NavParams,
        public view: ViewController,
        public stocks: StockService
    ) {
        //Get the stock object from the parent page
        this.stock = navParams.get('stock');
        //Did we get a stock value?
        if (!this.stock) {
            //Then create an empty one
            this.stock = {};
            this.stock.symbol = '';
            this.stock.name = '';
        }
    }

    ionViewDidLoad() {
        // console.log('Stock Search: Entering ionViewDidLoad');
    }

    ionViewDidEnter() {
        //Set the browser window title, just because we can
        this.app.setTitle(this.config.appNameShort + ': Stock Search');
    }

    doSearch() {
        console.log(`Research: doSearch (${this.searchStr})`);
        this.hasSearched = true;
        //empty our current stock list during the search process
        this.stockList = [];
        this.hasSearchResults = false;
        this.stocks.companyLookup(this.searchStr).then(data => {
            if (data) {
                this.hasSearchResults = true;
                this.stockList = data;
            }
        });
    }

    selectStock(stock: any) {
        //Set the local stock object to the selected stock
        this.stock = stock;
    }

    dismiss() {
        //Since the user cancelled, don't return any data to the page
        this.view.dismiss();
    }

    save() {
        this.view.dismiss(this.stock);
    }

}
