import { Component } from '@angular/core';
import { AlertController, App, NavController, NavParams, ViewController } from 'ionic-angular';
import { Config } from '../../providers/config';

@Component({
    selector: 'page-client-form',
    templateUrl: 'client-form.html'
})
export class ClientForm {

    client: any;
    blankStr = "";

    constructor(
        private alertController: AlertController,
        public app: App,
        public config: Config,
        public nav: NavController,
        navParams: NavParams,
        public view: ViewController
    ) {
        //Get the client record from the parent page
        this.client = navParams.get('client');
        //Do we have a client?
        if (!this.client) {
            //No? Then we must be adding a new client
            console.log('ClientForm: Creating client record');
            //First, create an empty object
            this.client = {};
            //Then, create each object property for the ngModel
            // this.client.id = this.blankStr;
            this.client.name = this.blankStr;
            this.client.email = this.blankStr;
            this.client.address = this.blankStr;
            this.client.city = this.blankStr;
            this.client.state = this.blankStr;
            this.client.zip = this.blankStr;
            this.client.phone1 = this.blankStr;
            this.client.phone2 = this.blankStr;
        }
    }

    ionViewDidLoad() {
        // console.log('Client Form: Entering ionViewDidLoad');
    }

    ionViewDidEnter() {
        //Set the window title for the browser, just because we can     
        this.app.setTitle(this.config.appNameShort + ': Client');
    }

    dismiss() {
        console.log('Client Form: Canceling');
        //Since the user cancelled, don't return any data to the page
        this.view.dismiss();
    }

    save() {
        console.log('Client Form: Saving');
        //do we at least have a name?
        if (this.client.name.length < 1) {
            //No, then warn the user
            console.log('Client Form: Name field is blank')
            let alert = this.alertController.create({
                title: this.config.appNameShort,
                message: 'You must provide a value for the <strong>Name</strong> field.',
                buttons: [{ text: 'Try Again' }]
            });
            alert.present();
        } else {
            //Return the form's data (the client object) to the page
            this.view.dismiss(this.client);
        }
    }
}
