import { Injectable } from '@angular/core';
import { AlertController, Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';
//Providers
import { ClientData } from './client-data';
import { Config } from './config';

@Injectable()
export class UserData {

    client: Microsoft.WindowsAzure.MobileServiceClient;
    private loggedIn: boolean = false;

    constructor(
        public alertController: AlertController,
        private clientData: ClientData,
        private config: Config,
        private events: Events,
        private storage: Storage
    ) { }

    public login() {
        console.log('UserData: Logging in');
        if (typeof WindowsAzure == "undefined") {
            //We're running in the browser, not a Cordova client
            console.warn('Running in demo mode (mock data)');
            //setup the client for local data access
            this.clientData.setDataProvider(this.config.defaultStorageType);
            //then let the user know server access isn't available
            let alert = this.alertController.create({
                title: this.config.appNameShort,
                message: `The <strong>Windows Azure Mobile Client</strong> is not available, using mock data instead.<br /><br />Did you remember to install the plugin?`,
                buttons: [{
                    text: 'OK',
                    handler: data => {
                        //Go ahead and simulate login, all you'll get is local, mock data
                        //with no updates
                        this.events.publish('user:login', {'client': {}});
                    }
                }]
            });
            alert.present();
        } else {
            //go ahead and login
            this.client = new WindowsAzure.MobileServiceClient(this.config.authEndpoint);
            this.client.login(this.config.authProvider).done(this.loginResponse.bind(this));
        }
    }

    private loginResponse(response: Microsoft.WindowsAzure.User) {
        console.log(`UserData: User "${response.userId} logged in`);
        //Record that we're logged-in
        this.loggedIn = true;
        //Let the rest of the app know the user has logged in
        //by firing the user:login event 
        this.events.publish('user:login', {'client': this.client});
    }

    public logout() {
        console.log('UserData: Logging out');
        if (this.client) {
            this.loggedIn = false;
            this.client.logout();
            this.client = null;
        } else {
            //This should never happen, unless we're in a mock environment
            console.error('UserData: client object is null');
        }
        //Let the rest of the app know the user has logged out
        //by firing the user:logout event
        this.events.publish('user:logout');
    }

    public isLoggedIn() {
        console.log('UserData: isLoggedIn');
        return this.loggedIn;
    }

    public getAzureClient(): any {
        return this.client;
    }
}
