import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
// providers
import { Config } from './config';
import { ClientDataStorage } from './client-data-storage';
import { ClientDataOffline } from './client-data-offline';
import { ClientDataOnline } from './client-data-online';

@Injectable()
export class ClientData {

  provider: any = ClientDataStorage;
  public storageType: String;

  constructor(
    private config: Config,
    //public events: Events,
    public localStore: ClientDataStorage,
    public offlineStore: ClientDataOffline,
    public onlineStore: ClientDataOnline,
    public platform: Platform,
  ) {
    console.log("ClientData: Constructor");
    // make sure the platform is ready before you do anything
    this.platform.ready().then(() => {
      console.log("ClientData: Platform is ready");
      // get the app's configured storage type from localStorage
      config.getStorageType().then((res) => {
        // set the data provider based on the current setting        
        this.setDataProvider(res);
      });
    });
  }

  public setDataProvider(storageType: string) {
    console.log(`ClientData: Using ${storageType} storage type`);
    this.storageType = storageType;
    // set the provider we'll use based on the storage type the user has
    // configured in the application
    switch (storageType) {
      case 'securestorage':
        this.provider = this.localStore;
        this.provider.init(true);
        break;
      case 'online':
        this.provider = this.onlineStore;
        this.provider.init();
        break;
      case 'offline':
        this.provider = this.offlineStore;
        this.provider.init();
        break;
      default:
        // use localstorage by default
        this.provider = this.localStore;
        this.provider.init(false);
    }
  }

  public showLogin(): boolean {
    return this.storageType == 'online';
    // may need to update this later to support offline (if it requires login as well)
    //return (this.storageType == 'online' || this.storageType == 'offline');
  }

}
