import { Component } from '@angular/core';
import { AlertController, App, NavController, Platform } from 'ionic-angular';
//Providers
import { ClientData } from '../../providers/client-data';
import { Config } from '../../providers/config';
import { UserData } from '../../providers/user-data';

@Component({
  selector: 'page-start',
  templateUrl: 'start.html'
})
export class StartPage {

  constructor(
    public alertController: AlertController,
    public app: App,
    public clientData: ClientData,
    public config: Config,
    public navCtrl: NavController,
    public platform: Platform,
    public user: UserData
  ) { }

  ionViewDidLoad() {
    console.log('Start Page: Entering ionViewDidLoad');
  }

  ionViewDidEnter() {
    console.log('Start Page: Entering ionViewDidEnter');
    this.platform.ready().then(() => {
      this.app.setTitle(this.config.appNameLong);
    });
  }

  doLogin() {
    console.log('Start Page: Entering doLogin');
    //When this is successful, the user:login event is fired and the ClientList 
    //page is displayed from there
    this.user.login();
  }

  showIonicInfo() {
    console.log('Start Page: Entering showIonicInfo');
    let alert = this.alertController.create({
      title: this.config.appNameShort,
      message: 'This application was hand crafted by professional software developers, working in a carefree environment, using <a href="http://taco.visualstudio.com/" target="_blank"><strong>Microsoft Visual Studio</strong></a> and the <a href="http://ionicframework.com/" target="_blank"><strong>Ionic 2</strong></a> framework.',
      buttons: [{ text: 'OK' }]
    });
    alert.present();
  }

}
