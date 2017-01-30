import { Component, ViewChild, NgZone } from '@angular/core';
import { AlertController, App, List, LoadingController, ModalController, NavController } from 'ionic-angular';
//Pages
import { ClientForm } from '../client-form/client-form';
import { ClientDetail } from '../client-detail/client-detail';
import { SettingsPage } from '../settings/settings';
//Providers
import { ClientData } from '../../providers/client-data';
import { Config } from '../../providers/config';

@Component({
    selector: 'page-client-list',
    templateUrl: 'client-list.html'
})
export class ClientList {
    // the list is a child of the page
    // @ViewChild('clientList') gets a reference to the list
    // with the variable #clientList, `read: List` tells it to return
    // the List and not a reference to the element
    @ViewChild('clientList', { read: List }) clientList: List;

    //the client list that's rendered in the view
    clients: any[] = [];
    //The list of all clients, may be filtered using the search bar
    allClients: any[] = [];

    constructor(
        public alertController: AlertController,
        public app: App,
        public clientData: ClientData,
        public config: Config,
        public loadingCtrl: LoadingController,
        public modalCtrl: ModalController,
        public nav: NavController,
        public zone: NgZone
    ) { }

    ionViewDidLoad() {
        //Update the client list on the page
        this.updateClients();
    }

    ionViewDidEnter() {
        //Set the window title for the browser, just because we can     
        this.app.setTitle(this.config.appNameShort + ': Client List');
    }

    filterList(ev: any) {
        //filters the client list based on input into the search bar
        // set val to the value of the searchbar's input field
        let val = ev.target.value;
        this.zone.run(() => {
            // if the value is an empty string don't filter the items
            if (val && val.trim() != '') {
                //Use the lower case search input
                val = val.toLowerCase();
                this.clients = this.allClients.filter((item) => {
                    return (item.name.toLowerCase().indexOf(val) > -1);
                });                
            } else {
                //no search string, so we'll use the full list
                this.clients = this.allClients;
            }
        });
    }

    onCancel(ev: any) {
        //Reset our list of clients to the full list
        this.zone.run(() => {
            this.clients = this.allClients;
        });
    }

    doRefresh(refresher) {
        console.log('Client List: Entering doRefresh');
        this.updateClients()
            .then(refresher.complete.bind(refresher));
    }

    updateClients() {
        //Refresh the client list content on the page
        console.log('Client List: Entering updateClients');
        // Close any open sliding items
        this.clientList && this.clientList.closeSlidingItems();
        //Create a loading indicator
        let loader = this.loadingCtrl.create({
            content: "Retrieving Client list"
        });
        loader.present();
        // Close any open sliding items
        this.clientList && this.clientList.closeSlidingItems();
        return this.clientData.provider.getClients()
            .then(clients => {
                //Hide the loading indicator
                loader.dismiss();
                this.zone.run(() => {
                    this.clients = clients;
                    this.allClients = clients;
                });
            });
    }

    showSettings() {
        console.log('Client List: Entering showSettings');
        //Create the settings form in a modal dialog
        let clientModal = this.modalCtrl.create(SettingsPage);
        //display the modal form
        console.log('Client List: Presenting Settings page (modal)');
        clientModal.present();
        //Do something with the returned data
        clientModal.onDidDismiss(data => {
            console.log('Client List: Settings form dismissed');
            if (data) {
                //We're changing data sources, so clear the client lists
                this.clients = [];
                this.allClients = [];
                console.log('Client List: Saving updated storage type');
                //Set the data provider based on the value returned by 
                //the settings page        
                this.config.setStorageType(data).then(res => {
                    //Change the data provider
                    this.clientData.setDataProvider(data);
                });
            } else {
                //The user must have cancelled
                console.log('No data returned from modal');
            }
        });
    }

    addClient() {
        console.log('Client List: Entering addClient');
        // Close any open sliding items
        this.clientList && this.clientList.closeSlidingItems();
        //Create the client form in a modal dialog
        let clientModal = this.modalCtrl.create(ClientForm);
        //display the modal form
        console.log('Client List: Presenting ClientForm');
        clientModal.present();
        //Do something with the returned data
        clientModal.onDidDismiss(data => {
            console.log('Client List: ClientForm modal dismissed');
            if (data) {
                //Process updated data
                this.clientData.provider.addClient(data).then(res => {
                    console.log('Client List: Client Added');
                    this.updateClients();
                });
            } else {
                //The user must have cancelled
                console.log('Client List: No data returned from modal');
            }
        });
    }

    deleteClient(client: any) {
        console.log(`Client List: Deleting "${client.name}"`);
        // Close any open sliding items
        this.clientList && this.clientList.closeSlidingItems();
        //Create the client form in a modal dialog
        let alertDlg = this.alertController.create({
            title: 'Delete Client',
            message: `Are you sure you want to delete ${client.name}?`,
            buttons: [
                {
                    text: 'No',
                    handler: data => {
                        console.log('Client List: Delete cancelled');
                    }
                },
                {
                    text: 'Yes',
                    handler: data => {
                        console.log('Client List: User approved deletion');
                        this.clientData.provider.deleteClient(client.id).then((res) => {
                            console.log('Client List: Client deleted');
                            this.updateClients();
                        });
                    }
                }
            ]
        });
        alertDlg.present();
    }

    editClient(client: any) {
        console.log(`Client List: Editing "${client.name}"`);
        // Close any open sliding items
        this.clientList && this.clientList.closeSlidingItems();
        //Create the client form in a modal dialog
        let clientModal = this.modalCtrl.create(ClientForm, { 'client': client });
        //display the modal form
        clientModal.present();
        //Do something with the returned data
        clientModal.onDidDismiss(data => {
            if (data) {
                //Process updated data
                this.clientData.provider.updateClient(data).then((res) => {
                    console.log('Client List: Client updated');
                    //this.updateClients();
                });
            } else {
                //The user must have cancelled
                console.log('Client List: No data returned from modal');
            }
        });
    }

    viewClient(client: any) {
        console.log(`Client List: Opening client "${client.name}"`);
        // Close any open sliding items
        this.clientList && this.clientList.closeSlidingItems();
        this.nav.push(ClientDetail, { client: client });
    }

}
