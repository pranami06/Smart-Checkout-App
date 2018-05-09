import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

/*
  Generated class for the ItemProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class ItemProvider {

  items: any;
  dataUrl = './assets/data/items.json';

  constructor(public http: HttpClient) {
    console.log('Hello ItemProvider Provider');

  }

  // get all items from json data list
  getAllItems() {
    console.log(this.dataUrl);
    return new Promise(resolve => {
      this.http.get(this.dataUrl)
        .subscribe(items => {
          this.items = items;
          resolve(this.items);
          //console.log(data);
        }, error => {
          console.log("Something went wrong!!");
        });
    });
  }
}
