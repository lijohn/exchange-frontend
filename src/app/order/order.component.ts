import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MarketsService } from '../markets.service';
import { Market } from '../market';
import { Order } from '../order';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.css']
})
export class OrderComponent implements OnInit {
  currentMarket: Market = new Market;
  order: Order = new Order;
  bidask: boolean = true;
  message: string;

  constructor(
    private route: ActivatedRoute,
    private market: MarketsService,
    private userService: UsersService
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.order.security = +params.id;
      this.getMarketData();
    })
    this.order.user = this.userService.getUser();
    this.order.pin = this.userService.getPin();
  }

  // rewrite the getMarket() route instead of finding here
  getMarketData(): void {
    this.market.getMarket(this.order.security).subscribe(result => this.currentMarket = result);
  }

  addOrder(): void {
    if (this.bidask) this.market.bid(this.order).subscribe(result => {
      if ((typeof result) == 'string') this.message = result;
      else {
        this.message = '';
        this.order.price = null;
        this.order.volume = null;
        this.getMarketData();
      }
    })
    else if (this.bidask === false) {
      this.market.ask(this.order).subscribe(result => {
        if ((typeof result) == 'string') this.message = result;
        else {
          this.message = '';
          this.order.price = null;
          this.order.volume = null;
          this.getMarketData();
        }
      })
    }
  }

  deleteExposure(): void {
    this.market.deleteExposure(this.order.security, { user: this.order.user, pin: this.order.pin })
      .subscribe(result => {
        this.message = result;
        this.getMarketData();
      });
  }

}
