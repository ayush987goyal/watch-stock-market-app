import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import * as io from 'socket.io-client';

@Injectable()
export class SocketService {

  // private url = "http://localhost:3000";
  private url = "/";
  private socket;

  constructor() { 
    this.socket = io(this.url);
  }

  addStock(stockData: any) {
    this.socket.emit('add-stock', stockData);
  }

  getStockAdded() {
    let observable = new Observable((observer) => {

      this.socket.on('stockAdded', (data) => {
        observer.next(data.stockData);
      })

      return () => {
        this.socket.disconnect();
      }
    })
    return observable;
  }

  removeStock(index: number) {
    this.socket.emit('remove-stock', index);
  }

  getStockRemoved() {
    let observable = new Observable((observer) => {

      this.socket.on('stockRemoved', (data) => {
        observer.next(data.stockIndex);
      })

    })
    return observable;
  }

}
