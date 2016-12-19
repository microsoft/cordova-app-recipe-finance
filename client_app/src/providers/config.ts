import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage';

@Injectable()
export class Config {

  //String values used in the app page titles and menus
  //The long version of the name appears in the header
  //of the start page
  appNameLong = 'TACO Investment Services';
  //The short version appears in the menu and all the other
  //form and page headers
  appNameShort = 'TACO';

  //change this endpoint for your Azure project
  authEndpoint = 'https://tacoinvestmenttracker.azurewebsites.net';

  //The MobileServiceClient supports multiple auth providers,
  //for this app, we'll just use AAD.
  authProvider = 'aad';    //Azure Active Directory

  //Used when creating secure storage
  secureStoreName = 'TACO-Investment-Tracker';

  //Storage types
  public defaultStorageType = 'localstorage';
  private storageTypeKey = 'storageType';

  constructor(
    private storage: Storage
  ) {
    console.log('Config: Constructor');
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
