import { Component } from '@angular/core';
import {AlertController, IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {PayPal, PayPalPayment, PayPalConfiguration} from "@ionic-native/paypal";
import { HomePage } from "../home/home";


/**
 * Generated class for the MyCartPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-my-cart',
  templateUrl: 'my-cart.html',
})
export class MyCartPage {


  cartData: any = [];
  cartItems: any = [];
  cartCount: number = 0;
  totalAmount: number = 0;

  constructor(public navCtrl: NavController,
              public navParams: NavParams,
              public viewCtrl: ViewController,
              public alertCtrl: AlertController,
              private payPal: PayPal) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MyCartPage');
    this.getDataInCart();
  }

  // get Data in cart from previous page
  getDataInCart(){
    console.log("Inside MyCartPage");
    this.cartData = this.navParams.get('modalData');
    this.cartCount = this.cartData.cartItemsCount;
    this.cartItems = this.cartData.cart;
    console.log("Cart Items are : ", this.cartData.cart);
    this.calculateTotal();
  }

  // calculate total of all the products
  calculateTotal(){
    if(this.cartItems.length){
      for(let item of this.cartItems){
        this.totalAmount = +this.totalAmount + +item.itemPriceTotal;
      }
    }
  }

  // for closing this modal
  closeModal() {
    this.viewCtrl.dismiss();
  }

  // make Payment if everything goes right
  makePayment(){
    this.cartItems = [];
    this.navCtrl.push(HomePage);
  }

  // paypal integeration for paying amount
  payCart(totalAmount: number){
    console.log("Inside payCart");
    this.payPal.init({
      PayPalEnvironmentProduction: '',
      PayPalEnvironmentSandbox: 'AfmsE2C6PMv7yQnCLAdjPWd2E6ujLpDrz46Z4NN36CIfYjlgA9ySBioYxkY1L-H3_GLDBVItUqymGA9_'
    }).then(() => {
       this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
      })).then(() => {
        let payment = new PayPalPayment(totalAmount.toString(), 'USD', 'Description', 'sale');
        this.payPal.renderSinglePaymentUI(payment).then((res) => {
          console.log("Result from paypal:", res);
        }).then(() => {
            this.successPaymentAlert();
         }, (err) => {
            console.log("Error", err);
            console.log("Your order has not been submitted");
            this.failurePaymentAlert();
        });
      }, (conf) => {
          console.log("Configuration Error", conf);
          console.log("Your order has not been submitted");
          this.failurePaymentAlert();
      });
    },(init) => {
        console.log("Init Error", init);
        console.log("Your order has not been submitted");
        this.failurePaymentAlert();
    });
  }

  // success payment alert
  successPaymentAlert(){
    let alert = this.alertCtrl.create({
      title: 'Payment Success',
      subTitle: 'Thank you for your payment!! <br> Your order has been placed successfully!!',
      buttons: ['Ok']
    });
    alert.present();
    alert.onDidDismiss(res => {
      this.makePayment();
    })
  }

  // failure Payment Alert
  failurePaymentAlert(){
    let alert = this.alertCtrl.create({
      title: 'Payment Failed' ,
      subTitle: 'Please scan items to continue shopping',
      buttons: [{
        text: 'Try Again',
        handler: () => {
          this.payCart(this.totalAmount);
        }
      },{
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    alert.present();
  }
}
