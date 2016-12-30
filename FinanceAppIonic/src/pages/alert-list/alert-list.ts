import { Component, ViewChild } from '@angular/core';
import { AlertController, App, List, ModalController, NavController } from 'ionic-angular';
//Pages
import { AlertDetail } from '../alert-detail/alert-detail';
import { AlertForm } from '../alert-form/alert-form';
//Providers
//Added ClientData for the form footer
import { ClientData } from '../../providers/client-data';
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
    public app: App,
    public clientData: ClientData,
    public config: Config,
    public modalCtrl: ModalController,
    public nav: NavController
  ) { }

  ionViewDidLoad() {
    // console.log('Alert List: Entering ionViewDidLoad');
  }

  ionViewDidEnter() {
    //Set the browser window title (just because)        
    this.app.setTitle(this.config.appNameShort + ': Alerts');
    //Update the alert list on the page
    this.updateAlerts();
  }

  updateAlerts() {
    //Refresh the client list content on the page
    console.log('Alert List: Entering updateAlerts');
    // Close any open sliding items when the list updates
    this.alertList && this.alertList.closeSlidingItems();
    return this.clientData.provider.getAlerts()
      .then(alerts => {
        this.alerts = alerts;
      });
  }

  deleteAlert(alert: any) {
    console.log(`Alert List: Deleting ${alert.name}`);
    //close any sliding items that may be open, so they're not open
    //when we get back from the modal dialog
    this.alertList && this.alertList.closeSlidingItems();
    //Create the client form in a modal dialog
    let alertDlg = this.alertController.create({
      title: 'Delete Alert',
      message: `Are you sure you want to delete <strong>${alert.name}</strong>?`,
      buttons: [{
        text: 'No',
        handler: data => {
          console.log('Delete cancelled');
        }
      },
      {
        text: 'Yes',
        handler: data => {
          console.log('Alert List: Executing delete');
          this.clientData.provider.deleteAlert(alert.id)
            .then(data => {
              console.log('Alert List: Deleted');
              this.updateAlerts();
            });
        }
      }
      ]
    });
    alertDlg.present();
  }

  editAlert(alert: any) {
    console.log('Alert List: Entering editAlert');
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
      console.log('Alert List: AlertForm modal dismissed');
      if (data) {
        //Process updated data
        this.clientData.provider.updateAlert(data)
          .then(data => {
            console.log('Alert List: Updated');
            this.updateAlerts();
          });
      } else {
        //The user must have cancelled
        console.log('No data returned from modal');
      }
    });
  }

  viewAlert(alert: any) {
    console.log(`Alert List: viewing ${alert.name}`);
    this.nav.push(AlertDetail, { 'alert': alert });
  }

}
