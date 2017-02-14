import { Injectable } from '@angular/core';
import { AlertController, Events } from 'ionic-angular';
// Providers
import { Config } from './config';

@Injectable()
export class ClientDataOffline {

    private client: Microsoft.WindowsAzure.MobileServiceClient;
    private store: Microsoft.WindowsAzure.MobileServiceSqliteStore;
    private syncContext: Microsoft.WindowsAzure.MobileServiceSyncContext;

    constructor(
        private alertController: AlertController,
        private config: Config,
        private events: Events,
    ) {
        console.log('ClientDataOffline: Constructor');

    }

    public init() {
        console.log('ClientDataOffline: Init');

        if (typeof WindowsAzure == "undefined") {
            //We're running in the browser, not a Cordova client
            console.warn('Running in demo mode (mock data)');
            // Let the user know server access isn't available
            let alert = this.alertController.create({
                title: this.config.appNameShort,
                message: `The <strong>Windows Azure Mobile Client</strong> is not available.<br /><br />Did you remember to install the plugin?`,
                buttons: [{ text: 'OK' }]
            });
            alert.present();
        } else {
            //go ahead and try to use the Azure mobile app client
            if (this.config.authEndpoint) {
                //Create the client object
                this.client = new WindowsAzure.MobileServiceClient(this.config.authEndpoint);
                if (this.client) {
                    // Get the sync context from the client
                    this.syncContext = this.client.getSyncContext();

                    //Now create the store object
                    var store = new WindowsAzure.MobileServiceSqliteStore('store.db');

                    store.defineTable({
                        name: 'todoitem',
                        columnDefinitions: {
                            id: 'string',
                            text: 'string',
                            complete: 'boolean',
                            version: 'string'
                        }
                    });

                } else {
                    let alert = this.alertController.create({
                        title: this.config.appNameShort,
                        message: `Unable to initialize the Azure Mobile App client. <br /><br />Did you remember to install the plugin?`,
                        buttons: [{ text: 'OK', }]
                    });
                    alert.present();
                }

            } else {
                let alert = this.alertController.create({
                    title: this.config.appNameShort,
                    message: `You must populate the Azure App Services <strong>authEndpoint</strong> (config.ts) before using this application in offline mode.`,
                    buttons: [{ text: 'OK', }]
                });
                alert.present();
            }
        }

        // let the rest of the app know we changed data sources
        this.events.publish('client-data:change');
    }

    private handleError(error) {
        //Executed whever remote data access encounters an error
        console.log('ClientDataOffline: handleError()');
        console.dir(error);
        var text = error + (error.request ? ' - ' + error.request.status : '');
        console.error(text);
        //Tell the user what happened
        let alert = this.alertController.create({
            title: this.config.appNameShort + ' Data Access Error',
            message: `An error ocurred while accessing the app's data: ${text}`,
            buttons: [{ text: 'OK' }]
        });
        alert.present();
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
