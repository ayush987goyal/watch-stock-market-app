import { Injectable } from '@angular/core';
import { Http, HttpModule } from '@angular/http';
import 'rxjs/add/operator/map';
import { config } from '../environments/config';

@Injectable()
export class MarketDataService {

  QUANDL_API_KEY = config.QUANDL_API_KEY;
  // localUrl: string = 'http://localhost:3000';
  localUrl: string = '';

  constructor(private http: Http) { }

  getQuandlUrl(stock: string) {
    let url = "https://www.quandl.com/api/v3/datasets/WIKI/" + stock + ".json?column_index=4&start_date=2016-01-01&end_date=2017-09-01&collapse=monthly&order=asc&api_key=" + this.QUANDL_API_KEY;
    return url;
  }

  getStockData(stock: string) {
    return this.http.get(this.getQuandlUrl(stock)).map(
      (res) => { return res.json(); }
    );
  }

  getAllStocks() {
    return this.http.get(this.localUrl + '/getStocks').map(
      (res) => { return res.json(); }
    );
  }

}
