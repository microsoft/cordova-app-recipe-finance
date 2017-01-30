import { Component } from '@angular/core';
import { App, NavController } from 'ionic-angular';

//Providers
import { Config } from '../../providers/config';

@Component({
    selector: 'page-about',
    templateUrl: 'about.html'
})
export class AboutPage {

    constructor(
        public app: App,
        public config: Config,
        public navCtrl: NavController
    ) { }

    ionViewDidLoad() {
        // console.log('About page Loaded');

    }

    ionViewDidEnter() {
        //Set the browser window title (just because)        
        this.app.setTitle(this.config.appNameShort + ': About');
    }

}
