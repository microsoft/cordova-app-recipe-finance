import { Injectable } from '@angular/core';
import { AlertController, Events } from 'ionic-angular';
import { Config } from './config';

@Injectable()
export class ClientDataOnline {

    azureAppService: Microsoft.WindowsAzure.MobileServiceClient;

    //Define some constants for our table names, so they
    //aren't represented as strings all throughtout the code
    tableAccounts = 'Accounts';
    tableAlerts = 'Alerts';
    tableClients = 'Clients';
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
        // //Are we running on a client that has the WindowsAzure client?
        // if (typeof WindowsAzure == "undefined") {
        //     //We'll be using mock data
        //     console.warn('ClientDataOnline: Skipping login event listeners');
        // } else {
        //     console.log('ClientDataOnline: Setting login event listeners');
        //     //Subscribe to the login event so we can set the app's 
        //     //Azure MobileServiceClient object when the user logs in      
        //     this.events.subscribe('user:login', (data) => {
        //         console.log('ClientDataOnline: Processing user:login event');
        //         //Pull the client object off of the data passed through the login event        
        //         this.azureAppService = data.client;
        //     });

        //     //Subscribe to the logout event so we can clear the app's 
        //     //Azure MobileServiceClient object when the user logs out      
        //     this.events.subscribe('user:logout', () => {
        //         console.log('ClientDataOnline: Processing user:logout event');
        //         //If we have an azureAppService object
        //         if (this.azureAppService) {
        //             //clear it out (set it to null)
        //             this.azureAppService = null;
        //         }
        //     });
        // }
    }

    public setClientObject(client) {
        console.log('ClientDataOnline: Setting client object');
        this.azureAppService = client;
    }

    private handleError(error) {
        //Executed whever remote data access encounters an error
        console.log('ClientDataOnline: handleError()');
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
        console.log('ClientDataOnline: getClients()');
        return new Promise(resolve => {
            //Are we logged in?
            if (this.azureAppService) {
                //Get a reference to the table we need
                let clientsTable = this.azureAppService.getTable(this.tableClients);
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
                console.error('ClientDataOnline: Online access not available, user is logged out');
                //return an empty list
                resolve([]);
            }
        });
    }

    public addClient(client: any): Promise<any> {
        console.log(`ClientDataOnline: Adding client: ${client.name}`);
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

    private showClientDeleteError(errMsg: string) {
        console.error(`ClientDataOnline: Unable to delete client`);
        let alert = this.alertController.create({
            title: this.config.appNameShort + ' Data Access Error',
            message: `An error ocurred deleting the client: ${errMsg}`,
            buttons: [{ text: 'OK' }]
        });
        alert.present();
    }

    private doDeleteClient(recordID: string): Promise<any> {
        console.log(`ClientDataOnline: Deleting client record ${recordID}`);
        return new Promise(resolve => {
            //Finally, start on deleting the actual client
            //start by getting a reference to the clients table 
            let clientsTable = this.azureAppService.getTable(this.tableClients);
            //delete the record
            clientsTable.del({ id: recordID }).then(data => {
                console.log(`ClientDataOnline: Successfully deleted client (${data})`);
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
        console.log(`ClientDataOnline: Initiating deletion of client record ${recordID}`);
        let hasError: boolean = false;
        return new Promise(resolve => {
            //Are we logged in?
            if (this.azureAppService) {
                //First get the list of accounts for this client
                this.getAccounts(recordID)
                    //Process the account list
                    .then(accountList => {
                        //Did we get anything back? We should have, no matter what
                        if (accountList) {
                            let numAccounts = accountList.length;
                            //Do we have results in the array?
                            if (numAccounts > 0) {
                                console.log(`ClientDataOnline: Found ${numAccounts} accounts`);
                                //For each account, get the list of investments
                                for (let account of accountList) {
                                    //Delete the account (which will also delete any investments associated with the account)
                                    console.error(`ClientDataOnline: Deleting account (${account.name})`);
                                    this.deleteAccount(account.id)
                                        .then(res => {
                                            console.log(`ClientDataOnline: Account deleted (${res})`);
                                        }, error => {
                                            hasError = true;
                                            console.error(`ClientDataOnline: Error deleting account (${error})`);
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
                            console.error('ClientDataOnline: getAccounts returned no data');
                            this.showClientDeleteError('Unable to retrieve account data.');
                            resolve({});
                        }
                    }, error => {
                        console.error('ClientDataOnline: getAccounts returned an error');
                        console.dir(error);
                        this.showClientDeleteError(error);
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

    public updateClient(client: any): Promise<any> {
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

    public getAccounts(recordID: string): Promise<any[]> {
        console.log('ClientDataOnline: getAccounts()');
        return new Promise(resolve => {
            //Are we logged in?
            if (this.azureAppService) {
                //Get a reference to the table we need      
                let accountsTable = this.azureAppService.getTable(this.tableAccounts);
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
                console.error('Online access not available, user is logged out');
                //return an empty list
                resolve([]);
            }
        });
    }

    public addAccount(account: any): Promise<any> {
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

    private showAccountDeleteError(errMsg: string) {
        console.error(`ClientDataOnline: Unable to delete client`);
        let alert = this.alertController.create({
            title: this.config.appNameShort + ' Data Access Error',
            message: `An error ocurred deleting the client: ${errMsg}`,
            buttons: [{ text: 'OK' }]
        });
        alert.present();
    }

    private doDeleteAccount(recordID: string): Promise<any> {
        console.log(`ClientDataOnline: Deleting account record ${recordID}`);
        return new Promise(resolve => {
            //Finally, start on deleting the actual account
            //start by getting a reference to the accounts table 
            let accountsTable = this.azureAppService.getTable(this.tableAccounts);
            //delete the record
            accountsTable.del({ id: recordID }).then((data) => {
                console.log(`ClientDataOnline: Successfully deleted account (${data})`);
                resolve(data);
            }, (error) => {
                this.handleError(error);
                resolve({});
            });
        });
    }

    public deleteAccount(recordID: string): Promise<any> {
        console.log(`ClientDataOnline: Initiating deletion of account ${recordID}`);
        let hasError: boolean = false;
        return new Promise(resolve => {
            //Are we logged in?
            if (this.azureAppService) {
                //First get the list of investments for this account
                this.getInvestments(recordID)
                    //Process the intestment list
                    .then(investmentList => {
                        //Did we get anything back? We should have, no matter what
                        if (investmentList) {
                            let numInvestments = investmentList.length;
                            //Do we have results in the array?
                            if (numInvestments > 0) {
                                console.log(`ClientDataOnline: Found ${numInvestments} investments`);
                                //For each account, get the list of investments
                                for (let investment of investmentList) {
                                    console.log(`ClientDataOnline: Deleting investment (${investment.name})`);
                                    //Delete the account (which will also delete any investments associated with the account)
                                    this.deleteInvestment(investment.id)
                                        .then(res => {
                                            console.log(`ClientDataOnline: Investment deleted (${res})`);
                                        }, error => {
                                            hasError = true;
                                            console.error(`ClientDataOnline: Error deleting investment (${error})`);
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
                            console.error('ClientDataOnline: getInvestments returned no data');
                            this.showAccountDeleteError('Unable to retrieve account data.');
                            resolve({});
                        }
                    }, error => {
                        console.error('ClientDataOnline: getInvestments returned an error');
                        console.dir(error);
                        this.showAccountDeleteError(error);
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

    public updateAccount(account: any): Promise<any> {
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

    public getInvestments(recordID: string): Promise<any[]> {
        console.log('ClientDataOnline: getInvestments()');
        return new Promise(resolve => {
            //Are we logged in?
            if (this.azureAppService) {
                //Get a reference to the table we need
                let investmentsTable = this.azureAppService.getTable(this.tableInvestments);
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
                console.error('Online access not available, user is logged out');
                //return an empty list
                resolve([]);
            }
        });
    }

    public addInvestment(investment: any): Promise<any> {
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

    public deleteInvestment(recordID: string): Promise<any> {
        console.log(`ClientDataOnline: Deleting investment record ${recordID}`);
        return new Promise(resolve => {
            //Are we logged in?
            if (this.azureAppService) {
                //Get a reference to the table we need
                let investmentsTable = this.azureAppService.getTable(this.tableInvestments);
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
                console.error('Online access not available, user is logged out');
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
            if (this.azureAppService) {
                //Get a reference to the table we need
                let alertsTable = this.azureAppService.getTable(this.tableAlerts);
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
                console.error('ClientDataOnline: Online access not available, user is logged out');
                //return an empty list
                resolve([]);
            }
        });
    }

    public addAlert(alert: any): Promise<any> {
        console.log(`ClientDataOnline: Adding alert: ${alert.name}`);
        return new Promise(resolve => {
            //Are we logged in?
            if (this.azureAppService) {
                //Get a reference to the table we need
                let alertsTable = this.azureAppService.getTable(this.tableAlerts);
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
                console.error('Online access not available, user is logged out');
                //return an empty record
                resolve({});
            }
        });
    }

    public deleteAlert(recordID: string): Promise<any> {
        console.log(`ClientDataOnline: Deleting record (ID: ${recordID})`);
        return new Promise(resolve => {
            //Are we logged in?
            if (this.azureAppService) {
                //Get a reference to the table we need
                let alertsTable = this.azureAppService.getTable(this.tableAlerts);
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
                console.error('Online access not available, user is logged out');
                //return an empty record
                resolve({});
            }
        });
    }

    public updateAlert(alert: any): Promise<any> {
        console.log(`ClientDataOnline: Editing alert "${alert.name}"`);
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
