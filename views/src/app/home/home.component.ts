import { Component, OnInit, ViewChild } from '@angular/core';
import { MarketDataService } from '../market-data.service';
import { NgForm } from "@angular/forms";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  stockData: any;
  chartData: any;
  isInvalid: boolean = false;
  @ViewChild('f') form: NgForm;

  constructor(private marketDataService: MarketDataService) { }

  ngOnInit() {
  }

  onStockClick(f) {
    this.isInvalid = false;
    this.marketDataService.getStockData(this.form.value.name).subscribe(
      (res) => {
        this.stockData = res;
        this.chartData = { labels: [], datasets: [] };
        this.chartData.datasets.push({
          label: this.stockData.dataset.dataset_code,
          data: [],
          fill: false,
          borderColor: '#4bc0c0'
        });
        for (let item of this.stockData.dataset.data) {
          this.chartData.labels.push(this.getGoodDate(item[0]));
          this.chartData.datasets[0]['data'].push(item[1]);
        }
      },
      (err) => {
        console.log(err);
        this.isInvalid = true;
      }
    );
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
