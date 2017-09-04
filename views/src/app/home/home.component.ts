import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MarketDataService } from '../market-data.service';
import { NgForm } from "@angular/forms";
import { SocketService } from '../socket.service';
import { BaseChartDirective } from 'ng2-charts';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit, OnDestroy {

  stockData: any;
  isInvalid: boolean = false;
  lineChartLabels: string[] = [];
  lineChartData: any[] = [];
  stockCards: any[] = [];
  @ViewChild('f') form: NgForm;
  @ViewChild('baseChart') chart: BaseChartDirective;

  addConnection;
  removeConenction;

  constructor(private marketDataService: MarketDataService, private socketService: SocketService) { }

  ngOnInit() {
    this.addConnection = this.socketService.getStockAdded().subscribe(
      (stockData) => {
        this.addToChartData(stockData);
      }
    );

    this.removeConenction = this.socketService.getStockRemoved().subscribe(
      (stockIndex) => {
        this.removeStockFromData(stockIndex);
      }
    );

    this.marketDataService.getAllStocks().subscribe(
      (allStocksData) => {
        for (let item of allStocksData) {
          this.addToChartData(item);
        }
      }
    );
  }

  ngOnDestroy() {
    this.addConnection.unsubscribe();
    this.removeConenction.unsubscribe();
  }

  onStockClick(f) {
    this.isInvalid = false;
    let pos = this.stockCards.map((e) => { return e.stockCode; }).indexOf((this.form.value.name).toUpperCase());
    if(pos >= 0){
      return;
    }
    this.marketDataService.getStockData(this.form.value.name).subscribe(
      (res) => {
        this.stockData = res;
        this.socketService.addStock(res);
        this.form.reset();
      },
      (err) => {
        // console.log(err);
        this.isInvalid = true;
      }
    );
  }

  onStockRemove(index) {
    this.socketService.removeStock(index);
  }

  addToChartData(stockerData: any) {
    let chartDataSize = this.lineChartData.length;
    this.lineChartLabels = [];

    this.lineChartData.push({
      label: stockerData.dataset.dataset_code,
      data: [],
      fill: false
    });

    for (let item of stockerData.dataset.data) {
      this.lineChartLabels.push(this.getGoodDate(item[0]));
      this.lineChartData[chartDataSize]['data'].push(item[1]);
    }

    this.stockCards.push({
      stockCode: stockerData.dataset.dataset_code,
      stockName: stockerData.dataset.name
    });

  }

  removeStockFromData(index) {
    this.stockCards.splice(index, 1);
    this.lineChartData.splice(index, 1);
    if (this.chart !== undefined) {
      this.chart.ngOnDestroy();
      this.chart.chart = this.chart.getChartBuilder(this.chart.ctx);
    }
  }

  getGoodDate(badDate: string) {
    let tempDate = new Date(badDate);
    let monthNames = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    let goodDate = monthNames[tempDate.getMonth()] + " " + tempDate.getFullYear();
    return goodDate;
  }

}
