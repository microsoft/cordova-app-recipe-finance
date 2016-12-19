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
  hasSearchResults = false;
  searchStr: string;

  constructor(
    public app: App,
    public config: Config,
    public nav: NavController,
    public navParams: NavParams,
    public stocks: StockService
  ) {

  }

  ionViewDidEnter() {
    console.log('Research: Entering ionViewDidEnter');
    //Set the browser window title (just because)        
    this.app.setTitle(this.config.appNameShort + ': Research');
  }

  doSearch() {
    console.log(`Research: doSearch (${this.searchStr})`);
    this.stocks.companyLookup(this.searchStr).then(data => {
      this.hasSearchResults = false;
      console.log(data);
      this.results = data;
    }, error => {
      console.error(error);
      this.hasSearchResults = true;
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
