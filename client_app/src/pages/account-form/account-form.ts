import { Component } from '@angular/core';
import { AlertController, App, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//Providers
import { Config } from '../../providers/config';

@Component({
  selector: 'page-account-form',
  templateUrl: 'account-form.html'
})
export class AccountForm {

  account: any;
  accountForm: FormGroup;

  constructor(
    private alertController: AlertController,
    public app: App,
    public config: Config,
    public formBuilder: FormBuilder,
    public navCtrl: NavController,
    navParams: NavParams,
    public view: ViewController
  ) {
    //Get the account record from the parent page
    this.account = navParams.get('account');
    //Do we have an account?
    if (!this.account) {
      //No? Then we must be adding a new client
      console.log('Account Form: Creating account record');
      //First, create an empty object
      this.account = {};
      //Then, create each object property for the ngModel
      this.account.name = '';
      //Set a default type of 'checking'
      this.account.type = 'Checking';
    }    

    this.accountForm = formBuilder.group({
      //Populate the formGroup with values from the passed-in,
      //or newly created account object
      name: [this.account.name, Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z ]*'), Validators.required])],
      type: [this.account.type, Validators.required]
    });
  }

  ionViewDidLoad() {
    // console.log('Account Form: Entering ionViewDidLoad');
  }

  ionViewDidEnter() {
    console.log('Account Form: Entering ionViewDidEnter');
    //Set the window title for the browser, just because we can     
    this.app.setTitle(this.config.appNameShort + ': Client List');
  }

  dismiss() {
    console.log('Account Form: Canceling');
    //Since the user cancelled, don't return any data to the page
    this.view.dismiss();
  }

  save() {
    //Forms overview by Josn Morony at
    //http://www.joshmorony.com/advanced-forms-validation-in-ionic-2/
    console.log('Account Form: Saving');
    //Is the form valid?
    if (this.accountForm.valid) {
      //then return the form's data (the account object) to the page
      this.account.name = this.accountForm.value.name;      
      this.account.type = this.accountForm.value.type;
      this.view.dismiss(this.account);
    } else {
      console.warn('Account Form: Form is invalid');
      let alert = this.alertController.create({
        title: this.config.appNameShort + ' Input Error',
        message: 'You must provide a value for the <strong>Name</strong> field and select an option for <strong>Account Type</strong>.',
        buttons: [{ text: 'Try Again' }]
      });
      alert.present();
    }
  }
}
