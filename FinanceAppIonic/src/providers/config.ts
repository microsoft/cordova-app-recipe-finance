import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class Config {

    //=======================================================
    // Developer Modified settings
    //
    // Change the settings in this section for your specific
    // needs and API keys
    //=======================================================  
    //String values used in the app page titles and menus
    //The long version of the name appears in the header
    //of the start page
    public readonly appNameLong = 'TACO Investment Services';
    //The short version appears in the menu and all the other
    //form and page headers
    public readonly appNameShort = 'TACO';

    //change this endpoint for your Azure project
    public readonly authEndpoint = 'https://tacoinvestmenttracker.azurewebsites.net';
    // public readonly authEndpoint = '';

    //The MobileServiceClient supports multiple auth providers,
    //for this app, we'll just use AAD.
    public readonly authProvider = 'aad';    //Azure Active Directory

    //API key used to access the Bing News search API
    //https://www.microsoft.com/cognitive-services/en-us/subscriptions
    readonly bingSearchKey = '152c382e98cf42cc8867f91d54821003';
    // bingSearchKey = '';  

    //Used when creating secure storage
    public readonly secureStoreName = 'TACO-Finance';

    //The default mode for the application. Changed via settings.
    public readonly defaultStorageType = 'localstorage';
    //=======================================================

    //Other storage settings
    private readonly storageTypeKey = 'storageType';

    //Define some constants for our table names, so they
    //aren't represented as strings all throughtout the code
    public readonly tableAccounts = 'Accounts';
    public readonly tableAlerts = 'Alerts';
    public readonly tableClients = 'Clients';
    public readonly tableInvestments = 'Investments';

    constructor(
        private storage: Storage
    ) {
        console.log('Config Provider: Constructor');

        //Warn if our Azure App Service endpoint is not populated in the config file (config.ts)    
        if (!this.authEndpoint) {
            //the user will see an alert if they try to login in online mode
            console.error('You must populate the Azure App Services authEndpoint variable (config.ts) before using this application in online mode.');
        }
        //Warn if our Bing news search API keys are not populated in the config file (config.ts)
        if (!this.bingSearchKey) {
            console.error('You must populate the Bing search API key (config.ts) in order to access the Research News capabilities of this application.');
        }
    }

    getStorageType(): Promise<string> {
        console.log('Config: Entering getStorageType');
        //Return a promise that we'll provide the storage type when available    
        return new Promise(resolve => {
            this.storage.get(this.storageTypeKey).then(res => {
                //Did we read a value from storage?
                if (res) {
                    console.log(`Config: Retrieved storage type: ${res}`);
                    //Yes? Then return it
                    resolve(res);
                } else {
                    //No? Then use the default value
                    //First write the default value to storage
                    this.setStorageType(this.defaultStorageType).then(() => {
                        console.log(`Config: Using default storage type: ${this.defaultStorageType}`);
                        //then return the default value
                        resolve(this.defaultStorageType);
                    }, error => {
                        resolve(this.defaultStorageType);
                    });
                }
            });
        });
    }

    setStorageType(storageType: String): Promise<any> {
        console.log('Config: Entering setStorageType');
        //Return a promise that we'll set the storage type when we can
        return new Promise(resolve => {
            return this.storage.set(this.storageTypeKey, storageType).then(res => {
                resolve(res);
            });
        });
    }
}
