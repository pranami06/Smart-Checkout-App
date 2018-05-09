import { Component } from '@angular/core';
import {AlertController, ModalController, NavController} from 'ionic-angular';
import {ItemProvider} from "../../providers/item/item";
import {BarcodeScanner, BarcodeScannerOptions} from "@ionic-native/barcode-scanner";
import {MyCartPage} from "../my-cart/my-cart";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  modal: any;
  options: BarcodeScannerOptions;
  itemId: any;
  allItems: any;
  scannedItem: any;
  cartItems: any = [];
  cartItemsCount: number = 0;
  itemExists: boolean = false;
  givenQty: number = 1;
  constructor(public navCtrl: NavController,
              public modalCtrl: ModalController,
              public barcodeScanner: BarcodeScanner,
              public itemProvider: ItemProvider,
              public alertCtrl: AlertController) {

  }

  ionViewDidLoad() {
    this.checkIfCartIsEmpty();
    this.getAllItems();
  }

  // getting all items from the provider
  getAllItems(){
    this.itemProvider.getAllItems()
      .then((items) =>{
        this.allItems = items;
        this.allItems = this.allItems.itemList;
      });
  }


  // check if cart is empty
  checkIfCartIsEmpty() {
    if(this.cartItems.length == 0){
      this.cartEmptyAlert();
    }
    else {
      this.scan();
    }
  }

  // scan items and fetch particular item's id
  scan() {
    this.options = {
      prompt: 'Scan a barcode to see results'
    }
    this.barcodeScanner.scan(this.options).then(barcodeData => {
      this.itemId = barcodeData.text;
      if(this.itemId){
        this.scannedItem = this.getItem(this.itemId);
        this.addToCart(this.scannedItem);
      }else {
        this.cartEmptyAlert();
      }

    }).catch(err => {
      console.log('Error', err);
    });
  }

  // get particular item based on id
  getItem (id: any) {
    for(let item of this.allItems)
    {
      if(id == item.id) {
        return item;
      }
    }
  }

  // check if item is already in car
  checkIfItemPresentInCart(item) {
    if(this.cartItems.length){
      for(let cartItem of this.cartItems){
        if(cartItem.id == item.id){
          this.itemExists = true;
          break;
        }
      }
    }
    return this.itemExists;
  }

  // add item to cart
  addToCart(item) {
    this.itemExists = false;
    if(this.checkIfItemPresentInCart(item)){
      this.itemExistsAlert();
    } else {
      this.cartItems.push(item);
      this.updateQuantity(item, this.givenQty);
    }

  }

  // update Quantity
  updateQuantity(item, givenQuantity) {
    if(givenQuantity == 0 ) {
      item.itemQty = givenQuantity;
      this.cartItems = this.cartItems.filter( data => data != item);
    } else if(givenQuantity != 1){
      item.itemQty = 0;
      item.itemQty = +givenQuantity;
      item.itemPriceTotal = +item.itemQty * +item.price;
    }
    else {
      item.itemQty = 1;
    }
    this.totalCartItemsQty();
  }

  // update total cart items quantity
  totalCartItemsQty () {
    this.cartItemsCount = 0;
    for(let cartitem of this.cartItems){
      this.cartItemsCount = +cartitem.itemQty + +this.cartItemsCount;
    }
    return this.cartItemsCount;
  }

  // Alert if item is already present
  itemExistsAlert() {
    let alert = this.alertCtrl.create({
      title: 'Item Exists!!',
      subTitle: 'Item is already in cart, please update the quantity',
      buttons: ['Ok']
    });
    alert.present();
  }

  // Alert if Cart is empty
  cartEmptyAlert(){
    let alert = this.alertCtrl.create({
      title: 'Cart Empty 🙃' ,
      subTitle: 'Please scan items to continue shopping',
      buttons: [{
        text: 'Scan Item',
        handler: () => {
          this.scan();
        }
      },{
        text: 'Cancel',
        role: 'cancel'
      }
      ]
    });
    alert.present();
  }

  // redirect to cart my-cart modal
  showCart() {
    const modalData = {
      cart: this.cartItems,
      cartItemsCount: this.cartItemsCount
    };

    // sending cartData to Cart Page
    this.modal = this.modalCtrl.create(MyCartPage,{modalData});
    this.modal.present();
  }

}
