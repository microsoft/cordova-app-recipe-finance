import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AlertController } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { SecureStorage } from 'ionic-native';
import { Config } from './config';

@Injectable()
export class ClientDataStorage {

  //Set this to false to skip importing data if storage
  //doesn't contain any values
  useSampleData = false;

  //The storage keys for our app data
  keyAccounts = 'Accounts';
  keyClients = 'Clients';
  keyInvestments = 'Investments';

  clients: Array<any> = [];
  accounts: Array<any> = [];
  investments: Array<any> = [];

  storage: any = this.localstorage;
  secureStorage: SecureStorage = new SecureStorage();

  constructor(
    private alertController: AlertController,
    private config: Config,
    private http: Http,
    private localstorage: Storage
  ) {
    console.log('ClientDataStorage: Constructor');
  }

  public init(useSecureStore: Boolean) {
    console.log('ClientDataStorage: Init');

    //Clear out our existing data values (just in case)
    this.clients = [];
    this.accounts = [];
    this.investments = [];

    if (useSecureStore) {
      console.log('ClientDataStorage: Secure Storage option enabled');
      //todo: Complete check for the cordova-plugin-secure-storage plugin
      console.debug('ADD CODE TO CHECK FOR cordova-plugin-secure-storage PLUGIN');
      //Are we running in a Cordova container?
      if (window['cordova']) {
        //Then use the SecureStorage 'driver'
        this.storage = this.secureStorage;
        console.log('ClientDataSecurestorage: Creating secure storage');
        this.storage.create(this.config.secureStoreName).then(
          () => {
            console.log('ClientDataSecurestorage: Storage created');
            // console.dir(this.storage);
          },
          error => console.error(error)
        );
      } else {
        console.log('ClientDataSecurestorage: Secure storage not available, switching to localstorage');
        //Warn the user that Secure won't work
        let alert = this.alertController.create({
          title: this.config.appNameShort + ' Provider Error',
          message: `SecureStorage is only available when running in a Cordova container. Switching to <strong>local storage</strong>.`,
          buttons: [{ text: 'OK' }]
        });
        alert.present();
        //Then use the Storage 'driver'
        this.storage = this.localstorage;
      }
    } else {
      console.log('ClientDataStorage: Localstorage option enabled');
      //Then use the Storage 'driver'
      this.storage = this.localstorage;
    }
  }

  private sortByName(data: Array<any>): Array<any> {
    //Sorts the array by name
    return data.sort(function (a, b) {
      var x = a.name.toLowerCase();
      var y = b.name.toLowerCase();
      if (x < y) { return -1; }
      if (x > y) { return 1; }
      return 0;
    });
  }

  private sortBySymbol(data: Array<any>): Array<any> {
    //Sorts the array by symbol
    return data.sort(function (a, b) {
      var x = a.symbol.toLowerCase();
      var y = b.symbol.toLowerCase();
      if (x < y) { return -1; }
      if (x > y) { return 1; }
      return 0;
    });
  }

  private getNewIndex(data: Array<any>): Number {
    console.log('ClientDataStorage: getNewIndex()');
    //Gets the highest index in the array, return index incremeneted by 1    
    //Is there any data in the array?
    if (data.length > 0) {
      //Then figure out what the highest index value is
      //start by sorting the array by client.id
      let res = data.sort(function (a, b) { return b.id - a.id });
      //The highest index will be in the first array item
      return res[0].id + 1;
    } else {
      //No data in the array? Then we'll start at 1
      return 1;
    }
  }

  /*******************************************************
   * Clients 
   *******************************************************/

  addClient(client: any): Promise<any> {
    console.log('ClientDataStorage: addClient()');
    //Add an index to the client object
    // console.dir(this.clients);
    client.id = this.getNewIndex(this.clients);
    //Add the new client to the clients array
    this.clients.push(client);
    //Sort our clients array (by name)
    this.clients = this.sortByName(this.clients);
    //write the clients array to storage
    return new Promise(resolve => {
      console.log('ClientDataStorage: Saving updated client list to storage');
      this.storage.set(this.keyClients, JSON.stringify(this.clients)).then(res => {
        resolve(res);
      });
    });
  }

  deleteClient(idx: Number): Promise<any> {
    console.log('ClientDataStorage: deleteClient()');
    let len = this.clients.length;
    return new Promise(resolve => {
      for (let i = 0; i < len; i++) {
        //Does this element have the specified index?
        if (this.clients[i].id === idx) {
          console.log(`ClientDataStorage: Deleting item #${i} from clients`);
          //then remove the ith element
          this.clients.splice(i, 1);
          //And jump out of the loop
          break;
        }
      }
      //Write the updated data to storage
      console.log('ClientDataStorage: Saving updated client list to storage');
      this.storage.set(this.keyClients, JSON.stringify(this.clients)).then(res => {
        resolve(res);
      });
    });
  }

  importData(ref: string): Promise<any> {
    //The only drawback of this appraoch is that if you delete these imported
    //records then close the app, they'll come back again the next time you 
    //start the app. To avoid this, when you delete the sample data, 
    //add at least one client back
    console.log('ClientDataStorage: Importing sample data');
    return new Promise(resolve => {
      if (this.useSampleData) {
        this.http.get('assets/data/data.json').subscribe(data => {
          //Parse the json data from the file
          resolve(data.json()[ref.toLowerCase()]);
        }, (error) => {
          resolve([]);
        });
      } else {
        resolve([]);
      }
    });
  }

  getClients(): Promise<any> {
    console.log('ClientDataStorage: getClients()');
    //Read the existing values from storage
    return new Promise(resolve => {
      //Do we have clients in the clients array?
      if (this.clients.length > 0) {
        //Then use them
        console.log('ClientDataStorage: Using in-memory client list');
        resolve(this.clients);
      } else {
        console.log('ClientDataStorage: Reading client list from storage');
        //Otherwise, go and get them...
        this.storage.get(this.keyClients).then(savedClients => {
          console.log('ClientDataStorage: Storage get completed');
          //Do we have a result?
          if (savedClients) {
            console.log('ClientDataStorage: Parsing client data from cache');
            //Store the data locally so the other methods will have access to it        
            this.clients = JSON.parse(savedClients);
            //Return the data if it exists
            resolve(this.clients);
          } else {
            //We didn't get a result, so there must not be any data there
            //Go ahead and import data from the included data file
            this.importData(this.keyClients).then(clients => {
              console.log('ClientDataStorage: Saving imported client list to storage');
              this.storage.set(this.keyClients, JSON.stringify(this.clients)).then(() => {
                this.clients = clients;
                resolve(clients);
              });
            }, () => resolve([]));
          }
        }, error => {
          //This happens when using SecureStorage, the get function returns
          //an error when it can't find the requested key (Localstorage doesn't
          //do this). So, when this happens, import the sample data from file
          console.log('ClientDataStorage: Error getting clients');
          console.log(error);
          this.importData(this.keyClients).then(clients => {
            console.log('ClientDataStorage: Saving imported client list to storage');
            this.storage.set(this.keyClients, JSON.stringify(this.clients)).then(() => {
              this.clients = clients;
              resolve(clients);
            });
          }, () => resolve([]));
        });
      }
    });
  }

  updateClient(client: any): Promise<any> {
    console.log('ClientDataStorage: updateClient()');
    let len = this.clients.length;
    let idx = client.id;
    return new Promise(resolve => {
      for (let i = 0; i < len; i++) {
        //Does this element have the specified index?
        if (this.clients[i].id === idx) {
          console.log(`ClientDataStorage: Updating item #${i} in clients`);
          //Set the current array item to the updated client
          this.clients[i] = client;
          //Sort the client list by name (just in case the name changed during this edit)
          this.clients = this.sortByName(this.clients);
          //And jump out of the loop
          break;
        }
      }
      //Write the updated data to storage
      console.log('ClientDataStorage: Saving updated client list to storage');
      this.storage.set(this.keyClients, JSON.stringify(this.clients)).then(res => {
        resolve(res);
      });
    });
  }

  /*******************************************************
   * Accounts
   *******************************************************/

  addAccount(account: any): Promise<any> {
    console.log('ClientDataStorage: createAccount()');
    //Add an index to the account object    
    //the account record should already have a clientID
    account.id = this.getNewIndex(this.accounts);
    //Add the new client to the clients array
    this.accounts.push(account);
    //Sort our clients array (by name)
    this.accounts = this.sortByName(this.accounts);
    //write the accounts array to storage
    return new Promise(resolve => {
      console.log('ClientDataStorage: Saving updated account list to storage');
      this.storage.set(this.keyAccounts, JSON.stringify(this.accounts)).then(res => {
        resolve(res);
      });
    });
  }

  deleteAccount(idx: Number): Promise<any> {
    console.log('ClientDataStorage: deleteAccount()');
    let len = this.accounts.length;
    return new Promise(resolve => {
      for (let i = 0; i < len; i++) {
        //Does this element have the specified index?
        if (this.accounts[i].id === idx) {
          console.log(`ClientDataStorage: Deleting item #${i} from accounts`);
          //then remove the ith element
          this.accounts.splice(i, 1);
          //And jump out of the loop
          break;
        }
      }
      //Write the updated data to storage
      console.log('ClientDataStorage: Saving updated account list to storage');
      this.storage.set(this.keyAccounts, JSON.stringify(this.accounts)).then(res => {
        resolve(res);
      });
    });
  }

  getAccounts(clientIdx: Number): Promise<any[]> {

    //Filter function used to return only Accounts for a specific clientId
    function accountFilter(element) {
      return element.clientId == clientIdx;
    }

    console.log('ClientDataStorage: getAccounts()');
    return new Promise(resolve => {
      //Do we have clients in the clients array?
      if (this.accounts.length > 0) {
        //Then use what we already have in-memory
        console.log('ClientDataStorage: Using in-memory account list');
        //This list is sorted, so no need to sort it again
        resolve(this.accounts.filter(accountFilter));
      } else {
        console.log('ClientDataStorage: Reading account list from storage');
        //Do we have accounts in storage?
        this.storage.get(this.keyAccounts).then(savedAccounts => {
          console.log('ClientDataStorage: Storage get completed');
          //Did we get data?
          if (savedAccounts) {
            //Use the values we have in storage
            console.log('ClientDataStorage: Parsing account data from cache');
            this.accounts = JSON.parse(savedAccounts);
            //Filter the array for only the accounts for the client ID passed in clientIdx 
            resolve(this.accounts.filter(accountFilter));
          } else {
            //Otherwise import the data from a file
            this.importData(this.keyAccounts).then(accounts => {
              console.log('ClientDataStorage: Saving imported account list to storage');
              //Write all of the account data to storage
              this.storage.set(this.keyAccounts, JSON.stringify(this.accounts))
                //Return just the accounts for the current client
                .then(() => {
                  this.accounts = accounts;
                  resolve(this.accounts.filter(accountFilter))
                });
            }, () => resolve([]));
          }
        }, error => {
          //This happens when using SecureStorage, the get function returns
          //an error when it can't find the requested key (Localstorage doesn't
          //do this). So, when this happens, import the sample data from file
          console.log('ClientDataStorage: Error getting accounts');
          console.log(error);
          this.importData(this.keyAccounts).then(accounts => {
            console.log('ClientDataStorage: Saving imported account list to storage');
            //Write all of the account data to storage
            this.storage.set(this.keyAccounts, JSON.stringify(this.accounts))
              //Return just the accounts for the current client
              .then(() => {
                this.accounts = accounts;
                resolve(this.accounts.filter(accountFilter))
              });
          }, () => resolve([]));
        });
      }
    });
  }

  updateAccount(account: any): Promise<any> {
    console.log('ClientDataStorage updateAccount()');
    let len = this.accounts.length;
    let idx = account.id;
    return new Promise(resolve => {
      for (let i = 0; i < len; i++) {
        //Does this element have the specified index?
        if (this.accounts[i].id === idx) {
          console.log(`ClientDataStorage: Updating item #${i} in accounts`);
          //Set the current array item to the updated client
          this.accounts[i] = account;
          //Sort the client list by name (just in case the name changed during this edit)
          this.accounts = this.sortByName(this.accounts);
          //And jump out of the loop
          break;
        }
      }
      //Write the updated data to storage
      console.log('ClientDataStorage: Saving updated account list to storage');
      this.storage.set(this.keyAccounts, JSON.stringify(this.accounts)).then(res => {
        resolve(res);
      });
    });
  }

  /*******************************************************
   * Investments
   *******************************************************/

  addInvestment(investment: any): Promise<any> {
    console.log('ClientDataStorage createInvestment()');
    //Add an index to the account object    
    //the account record should already have a clientID
    investment.id = this.getNewIndex(this.investments);
    //Add the new client to the clients array
    this.investments.push(investment);
    //Sort our investments array (by symbol)
    this.investments = this.sortBySymbol(this.investments);
    //write the investments array to storage
    return new Promise(resolve => {
      console.log('ClientDataStorage: Saving updated investment list to storage');
      this.storage.set(this.keyInvestments, JSON.stringify(this.investments)).then(res => {
        resolve(res);
      });
    });
  }

  deleteInvestment(idx: Number): Promise<any> {
    console.log('ClientDataStorage deleteInvestment()');    
    let len = this.investments.length;
    return new Promise(resolve => {
      for (let i = 0; i < len; i++) {
        //Does this element have the specified index?
        if (this.investments[i].id === idx) {
          console.log(`ClientDataStorage: Deleting item #${i} from investments`);
          //then remove the ith element
          this.investments.splice(i, 1);
          //And jump out of the loop
          break;
        }
      }
      //Write the updated data to storage
      console.log('ClientDataStorage: Saving updated investment list to storage');
      this.storage.set(this.keyInvestments, JSON.stringify(this.investments)).then(res => {
        resolve(res);
      });
    });
  }

  getInvestments(accountId: String): Promise<any[]> {

    //Filter function used to return only investments for a specific accountId
    function investFilter(element) {
      return element.accountId == accountId;
    }

    return new Promise(resolve => {
      console.log('ClientDataStorage getInvestments()');
      // do we have investments in the investments array?
      if (this.investments.length > 0) {
        //use the data we have in-memory
        console.log('ClientDataStorage: Using in-memory investment list');
        //Retrn the investment data, filtered by accountId
        resolve(this.investments.filter(investFilter));
      } else {
        console.log('ClientDataStorage: Reading client list from storage');
        this.storage.get(this.keyInvestments).then(savedInvestments => {
          //Do we have a result?
          if (savedInvestments) {
            console.log('ClientDataStorage: Retrieving investment data from cache');
            this.investments = JSON.parse(savedInvestments);
            //Retrn the investment data, filtered by accountId
            resolve(this.investments.filter(investFilter));
          } else {
            console.log('ClientDataStorage: Importing sample data');
            this.importData(this.keyInvestments).then(investments => {
              console.log('ClientDataStorage: Saving imported investment list to storage');
              this.storage.set(this.keyInvestments, JSON.stringify(this.investments)).then(() => {
                this.investments = investments;
                resolve(this.investments.filter(investFilter));
              });
            }, () => resolve([]));
          }
        }, error => {
          //This happens when using SecureStorage, the get function returns
          //an error when it can't find the requested key (Localstorage doesn't
          //do this). So, when this happens, import the sample data from file
          console.log('ClientDataStorage: Error getting investments');
          console.log(error);
          this.importData(this.keyInvestments).then(investments => {
            console.log('ClientDataStorage: Saving imported investment list to storage');
            this.storage.set(this.keyInvestments, JSON.stringify(this.investments)).then(() => {
              this.investments = investments;
              resolve(this.investments.filter(investFilter));
            });
          }, () => resolve([]));
        });
      }
    });
  }

}