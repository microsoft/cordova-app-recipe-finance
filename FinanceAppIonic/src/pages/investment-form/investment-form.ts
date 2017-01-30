import { Component } from '@angular/core';
import { AlertController, App, ModalController, NavController, NavParams, ViewController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StockSearch } from '../stock-search/stock-search';
import { Config } from '../../providers/config';

@Component({
    selector: 'page-investment-form',
    templateUrl: 'investment-form.html'
})
export class InvestmentForm {

    investment: any;
    investmentForm: FormGroup;
    blankStr = '';

    constructor(
        private alertController: AlertController,
        public app: App,
        public config: Config,
        public formBuilder: FormBuilder,
        public modalCtrl: ModalController,
        public nav: NavController,
        navParams: NavParams,
        public view: ViewController
    ) {
        //Get the client record from the parent page
        this.investment = navParams.get('investment');
        //Do we have an investment?
        if (!this.investment) {
            //No? Then we must be adding a new investment
            console.log('Investment Form: Creating investment record');
            //First, create an emptyinvestment object
            this.investment = {};
            //Then, create each object property for the ngModel
            this.investment.symbol = this.blankStr;
            this.investment.name = this.blankStr;
            this.investment.numberOfShares = 0;
            this.investment.purchasePrice = 0;
            this.investment.purchaseDate = new Date().toISOString();            
        }

        this.investmentForm = formBuilder.group({
            //Populate the formGroup with values from the passed-in,
            //or newly created investment object
            symbol: [
                this.investment.symbol,
                Validators.compose([Validators.minLength(1), Validators.maxLength(10),
                Validators.pattern('[a-zA-Z0-9]*'), Validators.required])
            ],
            numberOfShares: [
                this.investment.numberOfShares,
                Validators.compose([Validators.pattern('[0-9]*'), Validators.required])
            ],
            purchasePrice: [
                this.investment.purchasePrice,
                //Validators.compose([Validators.pattern('[0-9]*'), Validators.required])
                Validators.compose([Validators.pattern('[0-9]{1,7}(\.[0-9]+)?$'), Validators.required])
            ],
            purchaseDate: [
                this.investment.purchaseDate,
                Validators.required
            ]
        });
    }

    ionViewDidLoad() {
        // console.log('Investment Form: Entering ionViewDidLoad');
    }

    ionViewDidEnter() {
        //Set the window title for the browser, just because we can     
        this.app.setTitle(this.config.appNameShort + ': Investment');
    }
   
    dismiss() {
        //Since the user cancelled, don't return any data to the page
        this.view.dismiss();
    }

    save() {
        // console.dir(this.investmentForm);  
        //Is the input form valid?      
        if (this.investmentForm.valid) {
            //then return the form's data (the investment object) to the page           
            this.investment.symbol = this.investmentForm.value.symbol;
            this.investment.numberOfShares = this.investmentForm.value.numberOfShares;
            this.investment.purchasePrice = this.investmentForm.value.purchasePrice;
            this.investment.purchaseDate = this.investmentForm.value.purchaseDate;
            //Send the resulting data to the calling page
            this.view.dismiss(this.investment);
        } else {
            console.warn('Investment Form: Form is invalid');
            //Make an array of strings to hold the list of invalid fields    
            let fldLst = [];
            if (this.investmentForm.controls['symbol'].invalid) fldLst.push('Symbol');
            if (this.investmentForm.controls['numberOfShares'].invalid) fldLst.push('Number of Shares');
            if (this.investmentForm.controls['purchasePrice'].invalid) fldLst.push('Purchase Price');
            if (this.investmentForm.controls['purchaseDate'].invalid) fldLst.push('Purchase Date');
            //Split the field list array values with a comma-space  
            var res = fldLst.join(", ");
            // console.log(res);          
            let alert = this.alertController.create({
                title: this.config.appNameShort + ' Input Error',
                message: `One or more required fields are invalid or missing value(s). <br /><br />Please check the values for the following field(s): <strong>${res}</strong>.`,
                buttons: [{ text: 'Try Again' }]
            });
            alert.present();
        }
    }

}
