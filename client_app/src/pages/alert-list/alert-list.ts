import { Component, ViewChild } from '@angular/core';
import { AlertController, App, List, ModalController, NavController } from 'ionic-angular';
//Pages
import { AlertDetail } from '../alert-detail/alert-detail';
import { AlertForm } from '../alert-form/alert-form';
//Providers
//The alert capability is only available when online, so we can assume
//The generic data provider has already been initialized, and go directly
//against the alert data.
import { ClientDataOnline } from '../../providers/client-data-online';
import { Config } from '../../providers/config';

@Component({
  selector: 'page-alert-list',
  templateUrl: 'alert-list.html'
})
export class AlertList {

  @ViewChild('alertList', { read: List }) alertList: List;

  alerts: any[] = [];

  constructor(
    public alertController: AlertController,
    public alertData: ClientDataOnline,
    public app: App,
    public config: Config,
    public modalCtrl: ModalController,
    public nav: NavController
  ) { }

  ionViewDidLoad() {
    // console.log('Alert List: Entering ionViewDidLoad');
  }

  ionViewDidEnter() {
    console.log('Alert List: Entering ionViewDidEnter');
    //Set the browser window title (just because)        
    this.app.setTitle(this.config.appNameShort + ': Alerts');
    //Update the alert list on the page
    this.updateAlerts();
  }

  updateAlerts() {
    //Refresh the client list content on the page
    console.log('Client List: Entering updateClients');
    // Close any open sliding items when the list updates
    this.alertList && this.alertList.closeSlidingItems();
    return this.alertData.getAlerts().then(alerts => {
      this.alerts = alerts;
    });
  }

  deleteAlert(alert: any) {
    console.log(`Client List: Deleting ${alert.name}`);
    //close any sliding items that may be open, so they're not open
    //when we get back from the modal dialog
    this.alertList && this.alertList.closeSlidingItems();
    //Create the client form in a modal dialog
    let alertDlg = this.alertController.create({
      title: 'Delete Alert',
      message: `Are you sure you want to delete ${alert.name}?`,
      buttons: [
        {
          text: 'No',
          handler: data => {
            console.log('Delete cancelled');
          }
        },
        {
          text: 'Yes',
          handler: data => {
            console.log('Deleting %s', alert.name);
            this.alertData.deleteAlert(alert.id);
          }
        }
      ]
    });
    alertDlg.present();
  }

  editAlert(alert: any) {
    console.log('Client List: Entering editAlert');
    //close any sliding items that may be open, so they're not open
    //when we get back from the modal dialog
    this.alertList && this.alertList.closeSlidingItems();
    //Create the client form in a modal dialog
    let alertModal = this.modalCtrl.create(AlertForm, { 'alert': alert });
    //display the modal form
    console.log('Alert List: Presenting AlertForm');
    alertModal.present();
    //Do something with the returned data
    alertModal.onDidDismiss(data => {
      console.log('Client List: ClientForm modal dismissed');
      if (data) {
        //Process updated data
        this.alertData.updateAlert(data);
        //Update the client list
        this.updateAlerts();
      } else {
        //The user must have cancelled
        console.log('No data returned from modal');
      }
    });
    this.nav.push(AlertForm, { 'alert': alert });
  }

  viewAlert(alert: any) {
    console.log(`Client List: viewing ${alert.name}`);
    this.nav.push(AlertDetail, { 'alert': alert });
  }

}
