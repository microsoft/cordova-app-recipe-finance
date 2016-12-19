import { Injectable } from '@angular/core';
import { AlertController, Events } from 'ionic-angular';
import { Config } from './config';

/*****************************************************************
 * This code isn't very DRY at this moment. There's a lot of code 
 * duplicated in the CRUD operations defined below. We should 
 * probably refactor this code a bit to make it more DRY.
 *****************************************************************/

@Injectable()
export class ClientDataOnline {

  azureAppService: Microsoft.WindowsAzure.MobileServiceClient;

  //Define some constants for our table names, so they
  //aren't represented as strings all throughtout the code
  tableAlerts = 'Alerts';
  tableClients = 'Clients';
  tableAccounts = 'Accounts';
  tableInvestments = 'Investments';

  constructor(
    private alertController: AlertController,
    private config: Config,
    private events: Events,
  ) {
    console.log('ClientDataOnline: Constructor');
  }

  public init() {
    console.log('ClientDataOnline: Init');

    //Are we running on a client that has the WindowsAzure client?
    if (typeof WindowsAzure == "undefined") {
      //We'll be using mock data
      console.warn('ClientDataOnline: Skip setting login event listeners');
    } else {
      console.log('ClientDataOnline: Setting login event listeners');
      //Subscribe to the login event so we can set the app's 
      //Azure MobileServiceClient object when the user logs in      
      this.events.subscribe('user:login', (data) => {
        console.log('ClientDataOnline: Processing user:login event');
        //Pull the client object off of the data passed through the login event        
        this.azureAppService = data[0].client;
      });

      //Subscribe to the logout event so we can clear the app's 
      //Azure MobileServiceClient object when the user logs out      
      this.events.subscribe('user:logout', () => {
        console.log('ClientDataOnline: Processing user:logout event');
        //If we have an azureAppService object
        if (this.azureAppService) {
          //clear it out (set it to null)
          this.azureAppService = null;
        }
      });
    }

  }

  handleError(error) {
    //Executed whever remote data access encounters an error
    console.log('ClientDataOnline: handleError()');
    var text = error + (error.request ? ' - ' + error.request.status : '');
    console.error(text);
    //Tell the user what happened
    let alert = this.alertController.create({
      title: this.config.appNameShort + ' Data Access Error',
      message: `An error ocurred while accessing the app's data: ${text}`,
      buttons: [{ text: 'OK' }]
    });
    alert.present();
  }

  /*******************************************************
   * Clients 
   *******************************************************/

  getClients(): Promise<any[]> {
    console.log('ClientDataOnline: getClients()');
    return new Promise(resolve => {
      //Are we logged in?
      if (this.azureAppService) {
        //Get a reference to the table we need
        let clientsTable = this.azureAppService.getTable(this.tableClients);
        //did we get the table?
        if (clientsTable) {
          clientsTable
            //Sort by account name
            .orderBy('name')
            //Read all values from the table
            .read()
            //Process the data
            .then((data) => {
              //Return the data to the caller
              resolve(data);
            }, (error) => {
              //Display an error message
              this.handleError(error);
              //return an empty list
              resolve([]);
            });
        } else {
          console.error(`ClientDataOnline: Unable to get table ${this.tableClients}`);
          resolve([]);
        }
      } else {
        //this should only happen if there's a bug in the app
        console.error('ClientDataOnline: Online access not available, user is logged out');
        //return an empty list
        resolve([]);
      }
    });
  }

  addClient(client: any): Promise<any[]> {
    console.log('ClientDataOnline: addClient()');
    return new Promise(resolve => {
      //Are we logged in?
      if (this.azureAppService) {
        //Get a reference to the table we need
        let clientsTable = this.azureAppService.getTable(this.tableClients);
        //insert the record in the table
        clientsTable.insert(client).then((data) => {
          //Return the data to the caller
          resolve(data);
        }, (error) => {
          //Display an error message
          this.handleError(error);
          //return an empty record
          resolve({});
        });
      } else {
        //this should only happen if there's a bug in the app
        console.error('Online access not available, user is logged out');
        //return an empty record
        resolve({});
      }
    });
  }

  deleteClient(clientId: Number): Promise<any[]> {
    console.log('ClientDataOnline: deleteClient()');
    return new Promise(resolve => {
      //Are we logged in?
      if (this.azureAppService) {
        //Get a reference to the table we need
        let clientsTable = this.azureAppService.getTable(this.tableClients);
        //delete the record
        clientsTable.del(clientId).then((data) => {
          //Return the data to the caller
          resolve(data);
        }, (error) => {
          //Display an error message
          this.handleError(error);
          //return an empty record
          resolve({});
        });
      } else {
        //this should only happen if there's a bug in the app
        console.error('Online access not available, user is logged out');
        //return an empty record
        resolve({});
      }
    });
  }

  updateClient(client: any): Promise<any[]> {
    console.log('ClientDataOnline: updateClient()');
    return new Promise(resolve => {
      //Are we logged in?
      if (this.azureAppService) {
        //Get a reference to the table we need
        let clientsTable = this.azureAppService.getTable(this.tableClients);
        //update the record in the table
        clientsTable.update(client).then((data) => {
          //Return the data to the caller
          resolve(data);
        }, (error) => {
          //Display an error message
          this.handleError(error);
          //return an empty record
          resolve({});
        });
      } else {
        //this should only happen if there's a bug in the app
        console.error('Online access not available, user is logged out');
        //return an empty record
        resolve({});
      }
    });
  }

  /*******************************************************
   * Accounts
   *******************************************************/

  getAccounts(clientIdx: Number): Promise<any[]> {
    console.log('ClientDataOnline: getAccounts()');
    return new Promise(resolve => {
      //Are we logged in?
      if (this.azureAppService) {
        //Get a reference to the table we need      
        let accountsTable = this.azureAppService.getTable(this.tableAccounts);
        //Read all values from the table
        accountsTable
          //Only get the accounts for the current client
          .where({ clientId: clientIdx })
          //Sort by account name
          .orderBy('name')
          //read the table
          .read()
          //The deal with the results
          .then((data) => {
            //Return the data to the caller
            resolve(data);
          }, (error) => {
            //Display an error message
            this.handleError(error);
            //return an empty list
            resolve([]);
          });
      } else {
        //this should only happen if there's a bug in the app
        console.error('Online access not available, user is logged out');
        //return an empty list
        resolve([]);
      }
    });
  }

  addAccount(account: any): Promise<any[]> {
    console.log('ClientDataOnline: addAccount()');
    return new Promise(resolve => {
      //Are we logged in?
      if (this.azureAppService) {
        //Get a reference to the table we need
        let accountsTable = this.azureAppService.getTable(this.tableAccounts);
        //insert the record in the table
        accountsTable.insert(account).then((data) => {
          //Return the data to the caller
          resolve(data);
        }, (error) => {
          //Display an error message
          this.handleError(error);
          //return an empty record
          resolve({});
        });
      } else {
        //this should only happen if there's a bug in the app
        console.error('Online access not available, user is logged out');
        //return an empty record
        resolve({});
      }
    });
  }

  deleteAccount(accountId: Number): Promise<any[]> {
    console.log('ClientDataOnline: deleteAccount()');
    return new Promise(resolve => {
      //Are we logged in?
      if (this.azureAppService) {
        //Get a reference to the table we need
        let accountsTable = this.azureAppService.getTable(this.tableAccounts);
        //delete the record
        accountsTable.del(accountId).then((data) => {
          //Return the data to the caller
          resolve(data);
        }, (error) => {
          //Display an error message
          this.handleError(error);
          //return an empty record
          resolve({});
        });
      } else {
        //this should only happen if there's a bug in the app
        console.error('Online access not available, user is logged out');
        //return an empty record
        resolve({});
      }
    });
  }

  updateAccount(account: any): Promise<any[]> {
    console.log('ClientDataOnline: updateAccount()');
    return new Promise(resolve => {
      //Are we logged in?
      if (this.azureAppService) {
        //Get a reference to the table we need
        let accountsTable = this.azureAppService.getTable(this.tableAccounts);
        //Update the record in the table
        accountsTable.update(account).then((data) => {
          //Return the data to the caller
          resolve(data);
        }, (error) => {
          //Display an error message
          this.handleError(error);
          //return an empty record
          resolve({});
        });
      } else {
        //this should only happen if there's a bug in the app
        console.error('Online access not available, user is logged out');
        //return an empty record
        resolve({});
      }
    });
  }

  /*******************************************************
   * Investments
   *******************************************************/

  getInvestments(accountId: String): Promise<any[]> {
    console.log('ClientDataOnline: getInvestments()');
    return new Promise(resolve => {
      //Are we logged in?
      if (this.azureAppService) {
        //Get a reference to the table we need
        let investmentsTable = this.azureAppService.getTable(this.tableInvestments);
        //Read all values from the table
        investmentsTable
          //Only get the accounts for the current client
          .where({ accountId: accountId })
          //Sort by symbol
          .orderBy('symbol')
          //read the table
          .read()
          //The deal with the results
          .then((data) => {
            //Return the data to the caller
            resolve(data);
          }, (error) => {
            //Display an error message
            this.handleError(error);
            //return an empty list
            resolve([]);
          });
      } else {
        //this should only happen if there's a bug in the app
        console.error('Online access not available, user is logged out');
        //return an empty list
        resolve([]);
      }
    });
  }

  addInvestment(investment: any): Promise<any[]> {
    console.log('ClientDataOnline: createInvestment()');
    return new Promise(resolve => {
      //Are we logged in?
      if (this.azureAppService) {
        //Get a reference to the table we need
        let investmentsTable = this.azureAppService.getTable(this.tableInvestments);
        //insert the record in the table
        investmentsTable.insert(investment).then((data) => {
          //Return the data to the caller
          resolve(data);
        }, (error) => {
          //Display an error message
          this.handleError(error);
          //return an empty record
          resolve({});
        });
      } else {
        //this should only happen if there's a bug in the app
        console.error('Online access not available, user is logged out');
        //return an empty record
        resolve({});
      }
    });
  }

  deleteInvestment(investmentId: Number): Promise<any[]> {
    console.log('ClientDataOnline: deleteInvestment()');
    return new Promise(resolve => {
      //Are we logged in?
      if (this.azureAppService) {
        //Get a reference to the table we need
        let investmentsTable = this.azureAppService.getTable(this.tableInvestments);
        //Delete the record
        investmentsTable.del(investmentId).then((data) => {
          //Return the data to the caller
          resolve(data);
        }, (error) => {
          //Display an error message
          this.handleError(error);
          //return an empty record
          resolve({});
        });
      } else {
        //this should only happen if there's a bug in the app
        console.error('Online access not available, user is logged out');
        //return an empty record
        resolve({});
      }
    });
  }

  /*******************************************************
   * Alerts
   *******************************************************/

  getAlerts(): Promise<any[]> {
    console.log('AlertData: Getting Alert List');
    return new Promise(resolve => {
      //Are we logged in?
      if (this.azureAppService) {
        //Get a reference to the table we need
        let alertsTable = this.azureAppService.getTable(this.tableAlerts);
        //did we get the table?
        if (alertsTable) {
          alertsTable
            //Sort by account name
            .orderBy('name')
            //Read all values from the table
            .read()
            //Process the data
            .then((data) => {
              //Return the data to the caller
              resolve(data);
            }, (error) => {
              //Display an error message
              this.handleError(error);
              //return an empty list
              resolve([]);
            });
        } else {
          console.error(`ClientDataOnline: Unable to get table ${this.tableAlerts}`);
          resolve([]);
        }
      } else {
        //this should only happen if there's a bug in the app
        console.error('ClientDataOnline: Online access not available, user is logged out');
        //return an empty list
        resolve([]);
      }
    });
  }

  addAlert(alert: any) {
    console.log(`AlertData: Adding alert: ${alert.name}`);
    return new Promise(resolve => {
      //Are we logged in?
      if (this.azureAppService) {
        //Get a reference to the table we need
        let clientsTable = this.azureAppService.getTable(this.tableAlerts);
        //insert the record in the table
        clientsTable.insert(alert).then((data) => {
          //Return the data to the caller
          resolve(data);
        }, (error) => {
          //Display an error message
          this.handleError(error);
          //return an empty record
          resolve({});
        });
      } else {
        //this should only happen if there's a bug in the app
        console.error('Online access not available, user is logged out');
        //return an empty record
        resolve({});
      }
    });
  }

  deleteAlert(idx: String) {
    console.log(`AlertData: Deleting alert (ID: ${idx}`);
    return new Promise(resolve => {
      //Are we logged in?
      if (this.azureAppService) {
        //Get a reference to the table we need
        let alertsTable = this.azureAppService.getTable(this.tableAlerts);
        //delete the record
        alertsTable.del(idx).then((data) => {
          //Return the data to the caller
          resolve(data);
        }, (error) => {
          //Display an error message
          this.handleError(error);
          //return an empty record
          resolve({});
        });
      } else {
        //this should only happen if there's a bug in the app
        console.error('Online access not available, user is logged out');
        //return an empty record
        resolve({});
      }
    });
  }

  updateAlert(alert: any) {
    console.log(`AlertData: Editing alert: ${alert.name}`);
    return new Promise(resolve => {
      //Are we logged in?
      if (this.azureAppService) {
        //Get a reference to the table we need
        let alertsTable = this.azureAppService.getTable(this.tableAlerts);
        //update the record in the table
        alertsTable.update(alert).then((data) => {
          //Return the data to the caller
          resolve(data);
        }, (error) => {
          //Display an error message
          this.handleError(error);
          //return an empty record
          resolve({});
        });
      } else {
        //this should only happen if there's a bug in the app
        console.error('Online access not available, user is logged out');
        //return an empty record
        resolve({});
      }
    });
  }

}
