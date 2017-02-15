import { Injectable } from '@angular/core';
import { AlertController, Events } from 'ionic-angular';
// Providers
import { Config } from './config';

@Injectable()
export class ClientDataOffline {

    private client: any;
    private store: any;
    private syncContext: any;
    // private client: Microsoft.WindowsAzure.MobileServiceClient;
    // private store: Microsoft.WindowsAzure.MobileServiceSqliteStore;
    // private syncContext: Microsoft.WindowsAzure.MobileServiceSyncContext;

    constructor(
        private alertController: AlertController,
        private config: Config,
        private events: Events,
    ) {
        console.log('ClientDataOffline: Constructor');
    }

    public init() {
        console.log('ClientDataOffline: Init');
        if (typeof WindowsAzure == "undefined") {
            //We're running in the browser, not a Cordova client
            console.warn('Running in demo mode (mock data)');
            // Let the user know server access isn't available
            let alert = this.alertController.create({
                title: this.config.appNameShort,
                message: `The <strong>Windows Azure Mobile Client</strong> is not available.<br /><br />Did you remember to install the plugin?`,
                buttons: [{ text: 'OK' }]
            });
            alert.present();
        } else {
            //go ahead and try to use the Azure mobile app client
            if (this.config.authEndpoint) {
                //Create the client object
                this.client = new WindowsAzure.MobileServiceClient(this.config.authEndpoint);
                if (this.client) {
                    // Get the sync context from the client
                    console.log('Getting sync context');
                    this.syncContext = this.client.getSyncContext();

                    //Now create the store object
                    console.log('Creating store');
                    var store = new WindowsAzure.MobileServiceSqliteStore('store.db');


                    //UGLY UGLY UGLY CODE

                    store.defineTable({
                        name: this.config.tableClients,
                        columnDefinitions: {
                            id: 'string',
                            version: 'version',
                            name: 'string',
                            email: 'string',
                            address: 'string',
                            city: 'string',
                            state: 'string',
                            zip: 'string',
                            phone1: 'string',
                            phone2: 'string',
                            userId: 'string'
                        }
                    }).then(function () {
                        // table definition successful.
                        console.log(`Successfully created the ${this.config.tableClients} table`);
                        store.defineTable({
                            name: this.config.tableAccounts,
                            columnDefinitions: {
                                id: 'string',
                                version: 'version',
                                name: 'string',
                                type: 'string',
                                userId: 'string',
                                clientId: 'string'
                            }
                        }).then(function () {
                            // table definition successful.
                            console.log(`Successfully created the ${this.config.tableAccounts} table`);

                            store.defineTable({
                                name: this.config.tableInvestments,
                                columnDefinitions: {
                                    id: 'string',
                                    name: 'string',
                                    version: 'version',
                                    symbol: 'string',
                                    numberOfShares: 'string',
                                    purchasePrice: 'string',
                                    purchaseDate: 'string',
                                    accountId: 'string',
                                    userId: 'string'
                                }
                            }).then(function () {
                                // table definition successful.
                                console.log(`Successfully created the ${this.config.tableInvestments} table`);
                                this.syncContext.initialize(store).then(() => {
                                    this.syncContext.pushHandler = {
                                        onConflict: function (pushError) {
                                            // Handle the conflict.
                                            console.log("Sync conflict! " + pushError.getError().message);
                                            // Update failed, revert to server's copy.
                                            pushError.cancelAndDiscard();
                                        },
                                        onError: function (pushError) {
                                            // Handle the error
                                            // In the simulated offline state, you get "Sync error! Unexpected connection failure."
                                            console.log("Sync error! " + pushError.getError().message);
                                        }
                                    };
                                });
                            }, function (error) {
                                // table definition failed. handle error.
                                this.handleError(error);
                            });
                        }, function (error) {
                            // table definition failed. handle error.
                            this.handleError(error);
                        });
                    }, function (error) {
                        // table definition failed. handle error.
                        this.handleError(error);
                    });

                    //UGLY UGLY UGLY CODE

                } else {
                    let alert = this.alertController.create({
                        title: this.config.appNameShort,
                        message: `Unable to initialize the Azure Mobile App client. <br /><br />Did you remember to install the plugin?`,
                        buttons: [{ text: 'OK', }]
                    });
                    alert.present();
                }

            } else {
                let alert = this.alertController.create({
                    title: this.config.appNameShort,
                    message: `You must populate the Azure App Services <strong>authEndpoint</strong> (config.ts) before using this application in offline mode.`,
                    buttons: [{ text: 'OK', }]
                });
                alert.present();
            }
        }

        // let the rest of the app know we changed data sources
        this.events.publish('client-data:change');
    }

    private handleError(error) {
        //Executed whever remote data access encounters an error
        console.log('ClientDataOffline: handleError()');
        console.dir(error);
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

    public getClients(): Promise<any[]> {
        console.log('ClientDataOffline: getClients()');
        return new Promise(resolve => {
            //Are we logged in?
            if (this.client) {
                //Get a reference to the table we need
                let clientsTable = this.client.getSyncTable(this.config.tableClients);
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
                //this should only happen if there's a bug in the app
                console.error('ClientDataOffline: Offline access is not available');
                //return an empty list
                resolve([]);
            }
        });
    }

    public addClient(client: any): Promise<any> {
        console.log(`ClientDataOffline: Adding client: ${client.name}`);
        return new Promise(resolve => {
            //Are we logged in?
            if (this.client) {
                //Get a reference to the table we need
                let clientsTable = this.client.getSyncTable(this.config.tableClients);
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
                console.error('Offline access is not available');
                //return an empty record
                resolve({});
            }
        });
    }

    private showClientDeleteError(errMsg: string) {
        console.error(`ClientDataOffline: Unable to delete client`);
        let alert = this.alertController.create({
            title: this.config.appNameShort + ' Data Access Error',
            message: `An error ocurred deleting the client: ${errMsg}`,
            buttons: [{ text: 'OK' }]
        });
        alert.present();
    }

    private doDeleteClient(recordID: string): Promise<any> {
        console.log(`ClientDataOffline: Deleting client record ${recordID}`);
        return new Promise(resolve => {
            //Finally, start on deleting the actual client
            //start by getting a reference to the clients table 
            let clientsTable = this.client.getSyncTable(this.config.tableClients);
            //delete the record
            clientsTable.del({ id: recordID }).then(data => {
                console.log(`ClientDataOffline: Successfully deleted client (${data})`);
                resolve(data);
            }, error => {
                //Display an error message
                this.handleError(error);
                //return an empty record
                resolve({});
            });
        });
    }

    public deleteClient(recordID: string): Promise<any> {
        console.log(`ClientDataOffline: Initiating deletion of client record ${recordID}`);
        let hasError: boolean = false;
        return new Promise(resolve => {
            //Are we logged in?
            if (this.client) {
                //First get the list of accounts for this client
                this.getAccounts(recordID)
                    //Process the account list
                    .then(accountList => {
                        //Did we get anything back? We should have, no matter what
                        if (accountList) {
                            let numAccounts = accountList.length;
                            //Do we have results in the array?
                            if (numAccounts > 0) {
                                console.log(`ClientDataOffline: Found ${numAccounts} accounts`);
                                //For each account, get the list of investments
                                for (let account of accountList) {
                                    //Delete the account (which will also delete any investments associated with the account)
                                    console.error(`ClientDataOffline: Deleting account (${account.name})`);
                                    this.deleteAccount(account.id)
                                        .then(res => {
                                            console.log(`ClientDataOffline: Account deleted (${res})`);
                                        }, error => {
                                            hasError = true;
                                            console.error(`ClientDataOffline: Error deleting account (${error})`);
                                            console.dir(error);
                                        });
                                }
                                //Were we able to delete all accounts?
                                if (!hasError) {
                                    //Then delete the client                                              
                                    this.doDeleteClient(recordID).then(res => {
                                        resolve({});
                                    });
                                } else {
                                    this.showClientDeleteError('Unable to delete associated accounts.');
                                }
                            } else {
                                //No associated accounts, so go ahead and delete the client
                                this.doDeleteClient(recordID).then(res => {
                                    resolve({});
                                });
                            }
                        } else {
                            console.error('ClientDataOffline: getAccounts returned no data');
                            this.showClientDeleteError('Unable to retrieve account data.');
                            resolve({});
                        }
                    }, error => {
                        console.error('ClientDataOffline: getAccounts returned an error');
                        console.dir(error);
                        this.showClientDeleteError(error);
                        resolve({});
                    });
            } else {
                //this should only happen if there's a bug in the app
                console.error('Offline access is not available');
                //return an empty record
                resolve({});
            }
        });
    }

    public updateClient(client: any): Promise<any> {
        console.log('ClientDataOffline: updateClient()');
        return new Promise(resolve => {
            //Are we logged in?
            if (this.client) {
                //Get a reference to the table we need
                let clientsTable = this.client.getSyncTable(this.config.tableClients);
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
                console.error('Offline access is not available');
                //return an empty record
                resolve({});
            }
        });
    }

    /*******************************************************
     * Accounts
     *******************************************************/

    public getAccounts(recordID: string): Promise<any[]> {
        console.log('ClientDataOffline: getAccounts()');
        return new Promise(resolve => {
            //Are we logged in?
            if (this.client) {
                //Get a reference to the table we need      
                let accountsTable = this.client.getSyncTable(this.config.tableAccounts);
                //Read all values from the table
                accountsTable
                    //Only get the accounts for the current client
                    .where({ clientId: recordID })
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
                console.error('Offline access is not available');
                //return an empty list
                resolve([]);
            }
        });
    }

    public addAccount(account: any): Promise<any> {
        console.log('ClientDataOffline: addAccount()');
        return new Promise(resolve => {
            //Are we logged in?
            if (this.client) {
                //Get a reference to the table we need
                let accountsTable = this.client.getSyncTable(this.config.tableAccounts);
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
                console.error('Offline access is not available');
                //return an empty record
                resolve({});
            }
        });
    }

    private showAccountDeleteError(errMsg: string) {
        console.error(`ClientDataOffline: Unable to delete client`);
        let alert = this.alertController.create({
            title: this.config.appNameShort + ' Data Access Error',
            message: `An error ocurred deleting the client: ${errMsg}`,
            buttons: [{ text: 'OK' }]
        });
        alert.present();
    }

    private doDeleteAccount(recordID: string): Promise<any> {
        console.log(`ClientDataOffline: Deleting account record ${recordID}`);
        return new Promise(resolve => {
            //Finally, start on deleting the actual account
            //start by getting a reference to the accounts table 
            let accountsTable = this.client.getSyncTable(this.config.tableAccounts);
            //delete the record
            accountsTable.del({ id: recordID }).then((data) => {
                console.log(`ClientDataOffline: Successfully deleted account (${data})`);
                resolve(data);
            }, (error) => {
                this.handleError(error);
                resolve({});
            });
        });
    }

    public deleteAccount(recordID: string): Promise<any> {
        console.log(`ClientDataOffline: Initiating deletion of account ${recordID}`);
        let hasError: boolean = false;
        return new Promise(resolve => {
            //Are we logged in?
            if (this.client) {
                //First get the list of investments for this account
                this.getInvestments(recordID)
                    //Process the intestment list
                    .then(investmentList => {
                        //Did we get anything back? We should have, no matter what
                        if (investmentList) {
                            let numInvestments = investmentList.length;
                            //Do we have results in the array?
                            if (numInvestments > 0) {
                                console.log(`ClientDataOffline: Found ${numInvestments} investments`);
                                //For each account, get the list of investments
                                for (let investment of investmentList) {
                                    console.log(`ClientDataOffline: Deleting investment (${investment.name})`);
                                    //Delete the account (which will also delete any investments associated with the account)
                                    this.deleteInvestment(investment.id)
                                        .then(res => {
                                            console.log(`ClientDataOffline: Investment deleted (${res})`);
                                        }, error => {
                                            hasError = true;
                                            console.error(`ClientDataOffline: Error deleting investment (${error})`);
                                            console.dir(error);
                                        });
                                }
                                //Were we able to delete all investments?
                                if (!hasError) {
                                    //Then delete the account                     
                                    this.doDeleteAccount(recordID).then(res => {
                                        resolve({});
                                    });
                                } else {
                                    this.showAccountDeleteError('Unable to delete associated investments.');
                                }
                            } else {
                                this.doDeleteAccount(recordID).then(res => {
                                    resolve({});
                                });
                            }
                        } else {
                            console.error('ClientDataOffline: getInvestments returned no data');
                            this.showAccountDeleteError('Unable to retrieve account data.');
                            resolve({});
                        }
                    }, error => {
                        console.error('ClientDataOffline: getInvestments returned an error');
                        console.dir(error);
                        this.showAccountDeleteError(error);
                        resolve({});
                    });
            } else {
                //this should only happen if there's a bug in the app
                console.error('Offline access is not available');
                //return an empty record
                resolve({});
            }
        });
    }

    public updateAccount(account: any): Promise<any> {
        console.log('ClientDataOffline: updateAccount()');
        return new Promise(resolve => {
            //Are we logged in?
            if (this.client) {
                //Get a reference to the table we need
                let accountsTable = this.client.getSyncTable(this.config.tableAccounts);
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
                console.error('Offline access is not available');
                //return an empty record
                resolve({});
            }
        });
    }

    /*******************************************************
     * Investments
     *******************************************************/

    public getInvestments(recordID: string): Promise<any[]> {
        console.log('ClientDataOffline: getInvestments()');
        return new Promise(resolve => {
            //Are we logged in?
            if (this.client) {
                //Get a reference to the table we need
                let investmentsTable = this.client.getSyncTable(this.config.tableInvestments);
                //Read all values from the table
                investmentsTable
                    //Only get the accounts for the current client
                    .where({ accountId: recordID })
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
                console.error('Offline access is not available');
                //return an empty list
                resolve([]);
            }
        });
    }

    public addInvestment(investment: any): Promise<any> {
        console.log('ClientDataOffline: createInvestment()');
        return new Promise(resolve => {
            //Are we logged in?
            if (this.client) {
                //Get a reference to the table we need
                let investmentsTable = this.client.getSyncTable(this.config.tableInvestments);
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
                console.error('Offline access is not available');
                //return an empty record
                resolve({});
            }
        });
    }

    public deleteInvestment(recordID: string): Promise<any> {
        console.log(`ClientDataOffline: Deleting investment record ${recordID}`);
        return new Promise(resolve => {
            //Are we logged in?
            if (this.client) {
                //Get a reference to the table we need
                let investmentsTable = this.client.getSyncTable(this.config.tableInvestments);
                //Delete the record
                investmentsTable.del({ id: recordID }).then((data) => {
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
                console.error('Offline access is not available');
                //return an empty record
                resolve({});
            }
        });
    }

    /*******************************************************
     * Alerts
     *******************************************************/

    public getAlerts(): Promise<any[]> {
        console.log('AlertData: Getting Alert List');
        return new Promise(resolve => {
            //Are we logged in?
            if (this.client) {
                //Get a reference to the table we need
                let alertsTable = this.client.getSyncTable(this.config.tableAlerts);
                //did we get the table?
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
                //this should only happen if there's a bug in the app
                console.error('ClientDataOffline: Offline access is not available');
                //return an empty list
                resolve([]);
            }
        });
    }

    public addAlert(alert: any): Promise<any> {
        console.log(`ClientDataOffline: Adding alert: ${alert.name}`);
        return new Promise(resolve => {
            //Are we logged in?
            if (this.client) {
                //Get a reference to the table we need
                let alertsTable = this.client.getSyncTable(this.config.tableAlerts);
                //insert the record in the table
                alertsTable.insert(alert).then((data) => {
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
                console.error('Offline access is not available');
                //return an empty record
                resolve({});
            }
        });
    }

    public deleteAlert(recordID: string): Promise<any> {
        console.log(`ClientDataOffline: Deleting record (ID: ${recordID})`);
        return new Promise(resolve => {
            //Are we logged in?
            if (this.client) {
                //Get a reference to the table we need
                let alertsTable = this.client.getSyncTable(this.config.tableAlerts);
                //delete the record
                alertsTable.del({ id: recordID }).then((data) => {
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
                console.error('Offline access is not available');
                //return an empty record
                resolve({});
            }
        });
    }

    public updateAlert(alert: any): Promise<any> {
        console.log(`ClientDataOffline: Editing alert "${alert.name}"`);
        return new Promise(resolve => {
            //Are we logged in?
            if (this.client) {
                //Get a reference to the table we need
                let alertsTable = this.client.getSyncTable(this.config.tableAlerts);
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
                console.error('Offline access is not available');
                //return an empty record
                resolve({});
            }
        });
    }

}
