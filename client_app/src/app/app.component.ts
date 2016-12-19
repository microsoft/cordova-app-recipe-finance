/**************************************************************
 * TACO Finance Recipe - Ionic 2 Client Application 
 * 
 * By Jordan Matteisen and John M. Wargo
 * Created December, 2016
 * Copyright 2016 Microsoft Corporation 
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
    templateUrl: 'app.template.html'
})
export class ClientApp {
    // the root nav is a child of the root app component
    // @ViewChild(Nav) gets a reference to the app's root nav
    @ViewChild(Nav) nav: Nav;

    // List of pages that can be navigated to from the left menu
    // the left menu only works after login
    // the login page disables the left menu
    appPages: PageObj[] = [
        { title: 'Clients', component: ClientList, icon: 'contacts' },
        { title: 'Research', component: ResearchPage, icon: 'bookmarks' },
        { title: 'About', component: AboutPage, icon: 'information-circle' },
    ];

    loggedInPages: PageObj[] = [
        { title: 'Alerts', component: AlertList, icon: 'alert' },
        { title: 'Logout', component: StartPage, icon: 'log-out', logsOut: true }
    ];
   
    //Always start the app with the 'Start' page
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
            console.debug('Remember to add code to the HTML pages to restrict access for login scenarios');
            console.log('app.component: Platform is ready');

            //Cordova UI plugins initialization
            StatusBar.styleDefault();
            Splashscreen.hide();

            //Start listening for the login event
            this.events.subscribe('user:login', (data) => {
                //Data object is ignored here                
                //Open the client list page; don't navigate to it (so the user can 
                //navigate back later), but put it on top of the page stack
                this.nav.setRoot(ClientList);
            });

            //Start listening for the logout event
            this.events.subscribe('user:logout', () => {
                if (clientData.showLogin()) {
                    //Show the start page
                    this.nav.setRoot(StartPage);
                } else {
                    //Otherwise, open the client list page
                    this.nav.setRoot(ClientList);
                }
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
