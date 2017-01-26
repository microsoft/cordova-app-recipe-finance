import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { ClientApp } from './app.component';
import { Storage } from '@ionic/storage';

//Pages
import { AboutPage } from '../pages/about/about';
import { AccountDetail } from '../pages/account-detail/account-detail';
import { AccountForm } from '../pages/account-form/account-form';
import { AlertDetail } from '../pages/alert-detail/alert-detail';
import { AlertForm } from '../pages/alert-form/alert-form';
import { AlertList } from '../pages/alert-list/alert-list';
import { ClientDetail } from '../pages/client-detail/client-detail';
import { ClientForm } from '../pages/client-form/client-form';
import { ClientList } from '../pages/client-list/client-list';
import { InvestmentDetail } from '../pages/investment-detail/investment-detail';
import { InvestmentForm } from '../pages/investment-form/investment-form';
import { ResearchPage } from '../pages/research/research';
import { ResearchDetailPage } from '../pages/research-detail/research-detail';
import { SettingsPage } from '../pages/settings/settings';
import { StartPage } from '../pages/start/start';
import { StockSearch } from '../pages/stock-search/stock-search';

//Providers
import { ClientData } from '../providers/client-data';
import { ClientDataStorage } from '../providers/client-data-storage';
import { ClientDataOffline } from '../providers/client-data-offline';
import { ClientDataOnline } from '../providers/client-data-online';
import { Config } from '../providers/config';
import { StockService } from '../providers/stock-service';
import { UserData } from '../providers/user-data';

@NgModule({
    declarations: [
        ClientApp,
        AboutPage,
        AccountDetail,
        AccountForm,
        AlertDetail,
        AlertForm,
        AlertList,
        ClientDetail,
        ClientForm,
        ClientList,
        InvestmentDetail,
        InvestmentForm,
        ResearchDetailPage,
        ResearchPage,
        ResearchDetailPage,
        SettingsPage,
        StartPage,
        StockSearch
    ],
    imports: [
        IonicModule.forRoot(ClientApp)
    ],
    bootstrap: [IonicApp],
    entryComponents: [
        ClientApp,
        AboutPage,
        AlertDetail,
        AlertForm,
        AlertList,
        ClientDetail,
        ClientForm,
        ClientList,
        AccountForm,
        AccountDetail,
        InvestmentDetail,
        InvestmentForm,
        ResearchDetailPage,
        ResearchPage,
        SettingsPage,
        StartPage,
        StockSearch
    ],
    providers: [
        ClientData,
        ClientDataOffline,
        ClientDataOnline,
        ClientDataStorage,
        Config,
        StockService,
        UserData,
        Storage,
        { provide: ErrorHandler, useClass: IonicErrorHandler }
    ]
})
export class AppModule { }
