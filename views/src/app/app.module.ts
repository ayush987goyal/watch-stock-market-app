import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { NgModule } from '@angular/core';
import { ChartistModule } from 'ng-chartist';
import { ChartModule } from 'primeng/primeng';

import { AppComponent } from './app.component';
import { MarketDataService } from './market-data.service';
import { SocketService } from './socket.service';
import { HomeComponent } from './home/home.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ChartistModule,
    ChartModule
  ],
  providers: [MarketDataService, SocketService],
  bootstrap: [AppComponent]
})
export class AppModule { }
