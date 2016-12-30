import { Component } from '@angular/core';
import { AlertController, App, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
//Providers
import { Config } from '../../providers/config';

@Component({
  selector: 'page-alert-form',
  templateUrl: 'alert-form.html'
})
export class AlertForm {

  alert: any = {};
  alertForm: FormGroup;

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
    this.alert = navParams.get('alert');
    //Do we have an alert?
    if (!this.alert) {
      //We have to, we can't make one without a symbol
      console.error('');
      let alert = this.alertController.create({
        title: 'Application Error',
        message: 'The application cannot create an alert this way.',
        buttons: [{ text: 'Go Fix The Code' }]
      });
      alert.present();
    }

    this.alertForm = formBuilder.group({
      //Populate the formGroup with values from the passed-in,
      //or newly created account object
      //name: [this.alert.name, Validators.compose([Validators.maxLength(30), Validators.pattern('[a-zA-Z0-9 ]*'), Validators.required])],
      trigger: [this.alert.trigger, Validators.required],
      threshold: [this.alert.threshold, Validators.required],
      unit: [this.alert.unit, Validators.required],
    });
  }

  ionViewDidLoad() {
    // console.log('Alert Form: Entering ionViewDidLoad');
  }

  ionViewDidEnter() {
    //Set the window title for the browser, just because we can     
    this.app.setTitle(this.config.appNameShort + ': Alert');
  }

  dismiss() {
    console.log('Alert Form: Canceling');
    //Since the user cancelled, don't return any data to the page
    this.view.dismiss();
  }

  save() {
    console.log('Alert Form: Saving');
    //Return the form's data (the account object) to the page
    if (this.alertForm.valid) {
      //then return the form's data (the account object) to the page
      //this.alert.name = this.alertForm.value.name;
      this.alert.trigger = this.alertForm.value.trigger;
      this.alert.threshold = this.alertForm.value.threshold;
      this.alert.unit = this.alertForm.value.unit;
      this.alert.summary = this.createSummary(this.alert);
      this.view.dismiss(this.alert);
    } else {
      console.warn('Alert Form: Form is invalid');
      //Make an array of strings to hold the list of invalid fields    
      let fldLst = [];
      //if (this.alertForm.controls['name'].invalid) fldLst.push('Alert Title');
      if (this.alertForm.controls['trigger'].invalid) fldLst.push('Trigger');
      if (this.alertForm.controls['threshold'].invalid) fldLst.push('Threshold');
      if (this.alertForm.controls['unit'].invalid) fldLst.push('Unit');
      //Split the field list array values with a comma-space  
      var res = fldLst.join(", ");
      let alert = this.alertController.create({
        title: this.config.appNameShort + ' Input Error',
        message: `One or more required fields are invalid or missing value(s).<br /><br />Please check the values for the following field(s): <strong>${res}</strong>.`,
        buttons: [{ text: 'Try Again' }]
      });
      alert.present();
    }
  }

  createSummary(alert: any): string {
    //Build a summary description of the alert based on the user's selections on the form
    let triggers: any = {
      'A': { 'value': 'increases' },
      'B': { 'value': 'decreases' },
      'C': { 'value': 'changes value' }
    };
    let units: any = {
      'C': { 'value': 'currency units (dollars)' },
      'P': { 'value': 'percent' }
    };
    return `Stock price ${triggers[alert.trigger].value} by ${alert.threshold} ${units[alert.unit].value}`;
  }
}
