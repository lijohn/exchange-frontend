import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Market } from './market';
import { Order } from './order';

@Injectable({
  providedIn: 'root'
})
export class MarketsService {
  url:string = 'http://localhost:3000'

  constructor(private http: HttpClient) { }

  getMarket(id:number): Observable<Market> {
    return this.http.get<Market>(`${this.url}/markets/${id}`);
  }

  getAllMarkets(): Observable<Market[]> {
    return this.http.get<Market[]>(`${this.url}/markets/list`);
  }

  createMarket(market:Market): Observable<void> {
    return this.http.post<void>(`${this.url}/markets`, market);
  }

  bid(order:Order): Observable<void> {
    return this.http.post<void>(`${this.url}/bids`, order);
  }

  ask(order:Order): Observable<void> {
    return this.http.post<void>(`${this.url}/asks`, order);
  }

  deleteExposure(id:number, exposure:any): Observable<void> {
    return this.http.put<void>(`${this.url}/markets/${id}`, exposure);
  }
}
