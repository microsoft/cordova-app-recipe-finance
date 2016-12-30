import { Component, ViewChild } from '@angular/core';
import { AlertController, App, List, ModalController, NavController, NavParams } from 'ionic-angular';
//Pages
import { InvestmentDetail } from '../investment-detail/investment-detail';
import { InvestmentForm } from '../investment-form/investment-form';
//Providers
import { ClientData } from '../../providers/client-data';
import { Config } from '../../providers/config';

@Component({
  selector: 'page-account-detail',
  templateUrl: 'account-detail.html'
})
export class AccountDetail {

  @ViewChild('investmentList', { read: List }) investmentList: List;

  account: any;
  investments = [];

  constructor(
    public alertController: AlertController,
    public app: App,
    public clientData: ClientData,
    public config: Config,
    public modalCtrl: ModalController,
    public nav: NavController,
    public navParams: NavParams,
  ) {
    this.account = navParams.get('account');
  }

  ionViewDidEnter() {
    this.app.setTitle(this.config.appNameShort + ': Account Detail');
    this.updateInvestments();
  }

  updateInvestments() {
    console.log('Client Details: Entering updateInvestments');
    this.investmentList && this.investmentList.closeSlidingItems();
    this.clientData.provider.getInvestments(this.account.id).then(investments => {
      console.log('Received investment list');
      this.investments = investments;
    })
  }

  addInvestment() {
    console.log('Client Details: Entering addInvestment');
    //Create the investment form in a modal dialog
    let investmentModal = this.modalCtrl.create(InvestmentForm);
    //display the modal form
    console.log('Presenting modal form');
    investmentModal.present();
    //Do something with the returned data
    investmentModal.onDidDismiss(data => {
      console.log('Modal dismissed');
      if (data) {
        //Append the account ID to the record, so the data model
        //will know what account to associate this investment with
        data.accountId = this.account.id;
        //Write the new account to the store
        this.clientData.provider.addInvestment(data).then(res => {
          console.log('Client Details: Investment added');
          //Update the investment list
          this.updateInvestments();
        });
      } else {
        console.log('No data returned from modal');
      }
    });
  }

  deleteInvestment(investment: any) {
    console.log(`Client Details: Deleting "${investment.symbol}"`);
    this.investmentList && this.investmentList.closeSlidingItems();
    let alert = this.alertController.create({
      title: 'Delete Investment',
      message: `Are you sure you want to delete ${investment.symbol}?`,
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
            console.log(`Client Details: Confirmed deletion of "${investment.symbol}"`);
            this.clientData.provider.deleteInvestment(investment.id).then(res => {
              console.log('Client Details: Investment deleted');
              //Update the investment list
              this.updateInvestments();
            });
          }
        }
      ]
    });
    alert.present();
  }

  viewInvestment(investment: any) {
    console.log(`Account Details: Opening "${investment.symbol}"`);
    this.nav.push(InvestmentDetail, { 'investment': investment });
  }
}
