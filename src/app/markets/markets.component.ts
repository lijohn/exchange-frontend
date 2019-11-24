import { Component, OnInit } from '@angular/core';
import { MarketsService } from '../markets.service';
import { Market } from '../market';

@Component({
  selector: 'app-markets',
  templateUrl: './markets.component.html',
  styleUrls: ['./markets.component.css']
})
export class MarketsComponent implements OnInit {
  markets:Market[]; 

  constructor(private market: MarketsService) { }

  ngOnInit() {
    this.market.getAllMarkets().subscribe(result => this.markets = result);
  }

}
