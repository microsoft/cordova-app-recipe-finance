import { Injectable } from '@angular/core';
import { AlertController, Events } from 'ionic-angular';
//import { Http } from '@angular/http';
//import 'rxjs/add/operator/map';
import { Config } from './config';

@Injectable()
export class ClientDataOffline {

    constructor(
        private alertController: AlertController,
        private config: Config,
        private events: Events,
    ) {
        console.log('ClientDataOffline: Constructor');

    }

    public init() {
        console.log('ClientDataOffline: Init');
        let alert = this.alertController.create({
            title: this.config.appNameShort + ' Incomplete Implementation',
            message: 'Offline capabilities are not implemented yet. Please try again later.',
            buttons: [{ text: 'OK' }]
        });
        alert.present();

        // let the rest of the app know we changed data sources
        //this.events.publish('client-data:change');
    }

    /*******************************************************
     * Clients 
     *******************************************************/

    public getClients(): Promise<any[]> {
        console.log('ClientDataOffline: getClients()');
        return new Promise(resolve => {
            resolve([]);
        });
    }

    public addClient(client: any): Promise<any> {
        console.log(`ClientDataOffline: Adding client: ${client.name}`);
        return new Promise(resolve => {

        });
    }

    private showClientDeleteError(errMsg: string) {
        console.error(`ClientDataOffline: Unable to delete client`);
        let alert = this.alertController.create({
            title: this.config.appNameShort + ' Data Access Error',
            message: `An error ocurred deleting the client: ${errMsg}`,
            buttons: [{ text: 'OK' }]
        });
        alert.present();
    }

    private doDeleteClient(recordID: string): Promise<any> {
        console.log(`ClientDataOffline: Deleting client record ${recordID}`);
        return new Promise(resolve => {

        });
    }

    public deleteClient(recordID: string): Promise<any> {
        console.log(`ClientDataOffline: Initiating deletion of client record ${recordID}`);
        return new Promise(resolve => {

        });
    }

    public updateClient(client: any): Promise<any> {
        console.log('ClientDataOffline: updateClient()');
        return new Promise(resolve => {

        });
    }

    /*******************************************************
     * Accounts
     *******************************************************/

    public getAccounts(recordID: string): Promise<any[]> {
        console.log('ClientDataOffline: getAccounts()');
        return new Promise(resolve => {

        });
    }

    public addAccount(account: any): Promise<any> {
        console.log('ClientDataOffline: addAccount()');
        return new Promise(resolve => {

        });
    }

    private showAccountDeleteError(errMsg: string) {
        console.error(`ClientDataOffline: Unable to delete client`);
        let alert = this.alertController.create({
            title: this.config.appNameShort + ' Data Access Error',
            message: `An error ocurred deleting the client: ${errMsg}`,
            buttons: [{ text: 'OK' }]
        });
        alert.present();
    }

    private doDeleteAccount(recordID: string): Promise<any> {
        console.log(`ClientDataOffline: Deleting account record ${recordID}`);
        return new Promise(resolve => {

        });
    }

    public deleteAccount(recordID: string): Promise<any> {
        console.log(`ClientDataOffline: Initiating deletion of account ${recordID}`);
        let hasError: boolean = false;
        return new Promise(resolve => {

        });
    }

    public updateAccount(account: any): Promise<any> {
        console.log('ClientDataOffline: updateAccount()');
        return new Promise(resolve => {

        });
    }

    /*******************************************************
     * Investments
     *******************************************************/

    public getInvestments(recordID: string): Promise<any[]> {
        console.log('ClientDataOffline: getInvestments()');
        return new Promise(resolve => {

        });
    }

    public addInvestment(investment: any): Promise<any> {
        console.log('ClientDataOffline: createInvestment()');
        return new Promise(resolve => {

        });
    }

    public deleteInvestment(recordID: string): Promise<any> {
        console.log(`ClientDataOffline: Deleting investment record ${recordID}`);
        return new Promise(resolve => {

        });
    }

    /*******************************************************
     * Alerts
     *******************************************************/

    public getAlerts(): Promise<any[]> {
        console.log('AlertData: Getting Alert List');
        return new Promise(resolve => {

        });
    }

    public addAlert(alert: any): Promise<any> {
        console.log(`ClientDataOffline: Adding alert: ${alert.name}`);
        return new Promise(resolve => {

        });
    }

    public deleteAlert(recordID: string): Promise<any> {
        console.log(`ClientDataOffline: Deleting record (ID: ${recordID})`);
        return new Promise(resolve => {

        });
    }

    public updateAlert(alert: any): Promise<any> {
        console.log(`ClientDataOffline: Editing alert "${alert.name}"`);
        return new Promise(resolve => {

        });
    }

}
