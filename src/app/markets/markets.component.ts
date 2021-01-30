import { Component, OnInit } from '@angular/core';
import { MarketsService } from '../markets.service';
import { Market } from '../models/market';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-markets',
  templateUrl: './markets.component.html',
  styleUrls: ['./markets.component.css']
})
export class MarketsComponent implements OnInit {
  markets:Market[];

  constructor(private market: MarketsService, private user: UsersService) { }

  ngOnInit() {
    this.market.getAllMarkets(this.user.getUser(), this.user.getPin())
      .subscribe(result => this.markets = result);
  }

}
