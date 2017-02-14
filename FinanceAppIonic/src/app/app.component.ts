/**************************************************************
 * TACO Finance Recipe - Ionic 2 Client Application 
 * 
 * By Jordan Matteisen and John M. Wargo
 * Created December, 2016
 * Copyright 201 Microsoft Corporation 
 * https://github.com/Microsoft/cordova-app-recipe-finance
 **************************************************************/

import { Component, ViewChild } from '@angular/core';
import { Events, MenuController, Nav, Platform } from 'ionic-angular';
import { Splashscreen, StatusBar } from 'ionic-native';
//Pages
import { AboutPage } from '../pages/about/about';
import { AlertList } from '../pages/alert-list/alert-list';
import { ClientList } from '../pages/client-list/client-list';
import { ResearchPage } from '../pages/research/research';
import { StartPage } from '../pages/start/start';
//Providers
import { ClientData } from '../providers/client-data';
import { Config } from '../providers/config';
import { UserData } from '../providers/user-data';

export interface PageObj {
    title: string;
    component: any;
    icon: string;
    logsOut?: boolean;
    index?: number;
}

@Component({
    templateUrl: 'app.html'
})
export class ClientApp {
    // the root nav is a child of the root app component
    // @ViewChild(Nav) gets a reference to the app's root nav
    @ViewChild(Nav) nav: Nav;

    /* Create two arrays, one that lists the menu items that appear
       always, and another that lists the menu items that appear only
       when you're logged into the app. This isn't necessarily the 
       best way to do this, but it simplifies page loading through the 
       openPage function below. This code was harnessed (borrowed) from
       a conference app example.     */    
    appPages: PageObj[] = [
        { title: 'Clients', component: ClientList, icon: 'contacts' },
        { title: 'Research', component: ResearchPage, icon: 'bookmarks' },
        { title: 'About', component: AboutPage, icon: 'information-circle' }
    ];

    loggedInPages: PageObj[] = [
        { title: 'Alerts', component: AlertList, icon: 'alert' },
        { title: 'Logout', component: StartPage, icon: 'log-out', logsOut: true }
    ];

    //Configure the app to always start with the 'Start' page. This way, if there's
    //a logic error in the app, no data is displayed. Later on, the constructor
    //sets an event listener that opens the right page once a data provider has 
    //been successfully set.
    rootPage: any = StartPage;

    constructor(
        clientData: ClientData,
        public config: Config,
        public events: Events,
        public menu: MenuController,
        platform: Platform,
        public user: UserData
    ) {
        // Setup the UI, after the native app is ready
        platform.ready().then(() => {
            console.log('app.component: platform.ready()');

            //Cordova UI plugins initialization
            StatusBar.styleDefault();
            Splashscreen.hide();
        
            //Start listening for the login event
            this.events.subscribe('user:login', (data) => {
                console.log('app.component: Processing user:login event');
                //We're logging in, so we the appropriate provider needs access to the
                //client object. 
                clientData.provider.setClientObject(data.client);
                /*  Setting the client object (above) used to be handled by a login event 
                handler in the online provider. However, we ran into a timing issue where 
                the following line of code executed before the provider received the 
                event. This caused the app to open the page, but not display any data. 
                Setting the client object here fixed the problem, but violates some 
                separation of concerns rules. 
                
                Both online and offline modes need access to this client object, so the 
                logic is safe here as at this point, the app.component knows whether it 
                needs to support an authenticated user or not at this point and let the
                provider merely manage access to data. */

                //Open the client list page now that we're logged in
                this.nav.setRoot(ClientList);
            });

            //Listen for the logout event
            this.events.subscribe('user:logout', () => {
                console.log('app.component: Processing user:logout event');
                //We've logged out, so clear the provider's link to the Azure client.
                clientData.provider.setClientObject(null);
                //Then show the start page
                this.nav.setRoot(StartPage);
            });

            //Whenever the data source changes, we need to update the
            //app's UI accordingly. So, register an event listener
            //for the data source changed event
            this.events.subscribe('client-data:change', () => {
                console.log('app.component: Data source change detected');
                //Do we have an option that requires login?
                let showLogin = clientData.showLogin();
                //Set menu status (flip the menus)
                this.menu.enable(!showLogin, 'loggedOutMenu');
                this.menu.enable(showLogin, 'loggedInMenu');
                //Now, which page do we need to go to next?
                if (showLogin) {
                    //Show the start page (if login is required)
                    this.nav.setRoot(StartPage);
                } else {
                    //Otherwise, open the client list page
                    this.nav.setRoot(ClientList);
                }
            });

            //At this point, everything is setup and ready. 
            //Ionic will set the start page using the rootPage variable 
            //defined above. From there, the login process controls what
            //the user sees and can do

        });
    }

    openPage(page: PageObj) {
        //Does the page log the user out?
        if (page.logsOut === true) {
            //First, close the menu to get it out of the way
            this.menu.close();
            //Then log the user out
            this.user.logout();
            //Finally, the logout event listener opens the next page...
        } else {
            //Switch to the specified page
            this.nav.setRoot(page.component);
        }
    }

}
