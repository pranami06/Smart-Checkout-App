import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ItemProvider } from '../providers/item/item';
import {BarcodeScanner} from "@ionic-native/barcode-scanner";
import {MyCartPage} from "../pages/my-cart/my-cart";
import {HttpClientModule} from "@angular/common/http";
import {PayPal} from "@ionic-native/paypal";

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    MyCartPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    HttpClientModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    MyCartPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    ItemProvider,
    BarcodeScanner,
    PayPal
  ]
})
export class AppModule {}
