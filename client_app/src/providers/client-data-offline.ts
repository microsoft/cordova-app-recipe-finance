import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

@Injectable()
export class ClientDataOffline {

  constructor(
    public http: Http
  ) {
    console.log('ClientDataOffline: Constructor');

  }

  public init() {
    console.log('ClientDataOffline: Init');

  }

  /*******************************************************
   * Clients 
   *******************************************************/

  createClient() {
    console.log('ClientDataOffline createClient()');

  }

  deleteClient() {
    console.log('ClientDataOffline deleteClient()');

  }

  getClients() {
    console.log('ClientDataOffline getClients()');

  }

  updateClient() {
    console.log('ClientDataOffline updateClient()');

  }


  /*******************************************************
   * Accounts
   *******************************************************/

  createAccount() {
    console.log('ClientDataOffline createAccount()');

  }

  deleteAccount() {
    console.log('ClientDataOffline deleteAccount()');

  }

  getAccounts() {
    console.log('ClientDataOffline getAccounts()');

  }

  updateAccount() {
    console.log('ClientDataOffline updateAccount()');

  }


  /*******************************************************
   * Investments
   *******************************************************/

  createInvestment() {
    console.log('ClientDataOffline createInvestment()');

  }

  deleteInvestment() {
    console.log('ClientDataOffline deleteInvestment()');

  }

  getInvestments() {
    console.log('ClientDataOffline getInvestments()');

  }

  updateInvestment() {
    console.log('ClientDataOffline updateInvestment()');

  }
}
