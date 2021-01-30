import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MarketsService } from '../markets.service';
import { Market } from '../models/market';
import { Order } from '../models/order';
import { UsersService } from '../users.service';
import { GroupsService } from '../groups.service';

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
  settle: number;
  admin: boolean;

  constructor(
    private route: ActivatedRoute,
    private market: MarketsService,
    private userService: UsersService,
    private groupsService: GroupsService,
    private router: Router
  ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.order.security = +params.id;
      this.getMarketData();
    })
    this.order.user = this.userService.getUser();
    this.order.pin = this.userService.getPin();
  }

  toggleBidAsk(value: boolean): void {
    this.bidask = value;
  }

  getMarketData(): void {
    this.market.getMarket(this.order.security).subscribe(result => {
      this.currentMarket = result;
      this.currentMarket.create_time = this.currentMarket.create_time.replace(' ', 'T');
      // this.currentMarket.end_time = this.currentMarket.end_time.replace(' ', 'T');
      this.order.group = result.group_id;
      this.groupsService.getGroup(result.group_id).subscribe(group => {
        this.admin = this.groupsService.isAdmin(this.userService.getUser(), group);
      })
    });
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

  settleMarket(): void {
    this.market.settle(this.order.security, this.order.user, this.order.pin, this.settle, this.currentMarket.group_id)
      .subscribe(result => {
        if (result != null) this.message = result;
        else this.router.navigateByUrl(`/closed`);
      })
  }

}
