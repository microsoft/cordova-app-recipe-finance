import { Component } from '@angular/core';
import { App, NavController, NavParams } from 'ionic-angular';
//Providers
import { Config } from '../../providers/config';
import { StockService } from '../../providers/stock-service';
//Pages
import { ResearchDetailPage } from '../../pages/research-detail/research-detail';

@Component({
  selector: 'page-research',
  templateUrl: 'research.html'
})
export class ResearchPage {

  results: Array<any> = [];
  selectedSegment: string = 'search';
  hasSearched: boolean;
  hasSearchResults: boolean;
  searchStr: string;

  constructor(
    public app: App,
    public config: Config,
    public nav: NavController,
    public navParams: NavParams,
    public stocks: StockService
  ) {
    //Initialize this so our 'No results' warning is hidden at the start
      this.hasSearchResults = false;
    this.hasSearched = false;
  }

  ionViewDidEnter() {
    //Set the browser window title (just because)        
    this.app.setTitle(this.config.appNameShort + ': Research');
  }

  doSearch() {
    console.log(`Research: doSearch (${this.searchStr})`);
    this.hasSearched = true;
    this.stocks.companyLookup(this.searchStr).then(data => {
      if (data) {
        this.hasSearchResults = true;
        this.results = data;
      } else {
        this.hasSearchResults = false;
      }
    });
  }

  viewStock(stock: any) {
    console.log(`Research: Viewing "${stock.Symbol}"`);
    this.nav.push(ResearchDetailPage, { 'stock': stock });
  }

  openSite(site: string) {
    let targetSite = "";
    switch (site) {
      case "stocks":
        targetSite = 'http://www.google.com/finance';
        break;
      case "collegePlans":
        targetSite = 'http://www.savingforcollege.com';
        break;
    }
    if (targetSite.length > 0) {
      window.open(targetSite, "_blank", "hardwareback=no");
    }
  }
}
