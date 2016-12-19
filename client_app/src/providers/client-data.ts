import { Injectable } from '@angular/core';
import { Events, Platform } from 'ionic-angular';
//Providers
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
    public events: Events,
    public localStore: ClientDataStorage,
    public offlineStore: ClientDataOffline,
    public onlineStore: ClientDataOnline,
    public platform: Platform,
  ) {
    console.log('ClientData: Constructor');
    //Make sure the platform is ready before you do anything
    this.platform.ready().then(() => {
      console.log('ClientData: Platform is ready');
      //get the app's configured storage type from localStorage
      config.getStorageType().then((res) => {
        //Set the data provider based on the current setting        
        this.setDataProvider(res);
      });
    });
  }

  public setDataProvider(storageType: string) {
    console.log(`ClientData: Using ${storageType} storage type`);
    this.storageType = storageType;
    //Set the provider we'll use based on the storage type the user has
    //configured in the application
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
        //Use localstorage by default
        this.provider = this.localStore;
        this.provider.init(false);
    }
    //Let the rest of the app know we changed data sources
    this.events.publish('client-data:change');
  }

  public showLogin(): boolean {
    return this.storageType == 'online';
    //Update this later to support offline (if it requires login as well)
    //return (this.storageType == 'online' || this.storageType == 'offline');
  }

}
