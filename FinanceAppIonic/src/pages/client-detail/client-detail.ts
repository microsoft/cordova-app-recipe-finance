import { Component, ViewChild } from '@angular/core';
import { AlertController, App, List, ModalController, NavController, NavParams } from 'ionic-angular';
//Pages
import { AccountDetail } from '../account-detail/account-detail';
import { AccountForm } from '../account-form/account-form';
//Providers
import { ClientData } from '../../providers/client-data';
import { Config } from '../../providers/config';

@Component({
  selector: 'page-client-detail',
  templateUrl: 'client-detail.html'
})
export class ClientDetail {

  @ViewChild('accountList', { read: List }) accountList: List;

  selectedSegment: String = 'client';

  client: any;
  accounts: any[] = [];

  constructor(
    public alertController: AlertController,
    public app: App,
    public clientData: ClientData,
    public config: Config,
    public modalCtrl: ModalController,
    public nav: NavController,
    navParams: NavParams
  ) {
    this.client = navParams.get('client');
    // console.dir(this.client);
  }

  ionViewDidLoad() {
    // console.log('Client Detail: Entering ionViewDidLoad');    
  }

  ionViewDidEnter() {
    //Set the window title for the browser, just because we can
    this.app.setTitle(this.config.appNameShort + ': Client Details');
    //Update the account list
    this.getAccounts();
  }

  getAccounts() {
    console.log('Client Details: Entering getAccounts');
    //close any open slider items, if we have them
    this.accountList && this.accountList.closeSlidingItems();
    //Get the account data from the provider
    this.clientData.provider.getAccounts(this.client.id).then(accounts => {
      console.log('Received account list');
      // console.log(accounts);
      this.accounts = accounts;
    });
  }

  addAccount() {
    console.log(`Client Details: Entering addAccount`);
    //Create the account form in a modal dialog
    let accountModal = this.modalCtrl.create(AccountForm);
    //display the modal form
    console.log('Presenting modal form');
    accountModal.present();
    //Do something with the returned data
    accountModal.onDidDismiss(data => {
      console.log('Modal dismissed');
      if (data) {
        //Append the client ID to the record, so the data model
        //will know what client to associate this account with
        data.clientId = this.client.id;
        //Write the new account to the store
        this.clientData.provider.addAccount(data).then(res => {
          console.log('Client Details: Account added');
          //Update the account list
          this.getAccounts();
        });
      } else {
        console.log('No data returned from modal');
      }
    });
  }

  deleteAccount(account: any) {
    console.log(`Client Details: Deleting "${account.name}"`);
    //close any sliding items that may be open, so they're not open
    //when we get back from the modal dialog
    this.accountList && this.accountList.closeSlidingItems();
    //Create the client form in a modal dialog
    let alertDlg = this.alertController.create({
      title: 'Delete Account',
      message: `Are you sure you want to delete ${account.name}?`,
      buttons: [
        {
          text: 'No',
          handler: data => {
            console.log('Client Details: Delete cancelled');
          }
        },
        {
          text: 'Yes',
          handler: data => {
            console.log('Client Details: Deleting %s', account.name);
            this.clientData.provider.deleteAccount(account.id).then(res => {
              console.log('Client Details: Account deleted');
              //Update the account list
              this.getAccounts();
            });
          }
        }
      ]
    });
    alertDlg.present();
  }

  editAccount(account: any) {
    console.log(`Client Details: Editing "${account.name}"`);
    //Create the account form in a modal dialog
    let accountModal = this.modalCtrl.create(AccountForm, { 'account': account });
    //display the modal form
    console.log('Presenting modal form');
    accountModal.present();
    //Do something with the returned data
    accountModal.onDidDismiss(data => {
      console.log('Modal dismissed');
      if (data) {
        //Write the updated account to the store
        this.clientData.provider.updateAccount(data);
        //Update the account list
        this.getAccounts();
      } else {
        console.log('No data returned from modal');
      }
    });
  }

  viewAccount(account: any) {
    console.log(`Client Details: Opening "${account.name}"`);
    this.nav.push(AccountDetail, { 'account': account });
  }

  showMap() {
    console.log('Client Details: Entering showMap');
    //todo: add ability to open Google Maps to this location
    let alertDlg = this.alertController.create({
      title: 'Show Map',
      message: `Wouldn't it be cool if the app would open a map to <strong>${this.client.address}</strong>? We need to add that functionality.`,
      buttons: [{ text: 'Yes' }]
    });
    alertDlg.present();
  }

}
