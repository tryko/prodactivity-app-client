import { Router } from "@angular/router";
import { Observable } from "rxjs";
import 'rxjs/add/operator/catch'
import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

import "rxjs/add/operator/publishLast";
import "rxjs/add/operator/map";

import { Task } from "../model/task.model";

@Injectable()
export class ResultsService {
  private url = "http://localhost:3000/";

  constructor(private http: Http) { }

  getLatestRecord(): Observable<Task> {
    return this.http
      .get(this.url + "results/latest-result/")
      .map(res => this.extractData(res))
      .catch(err => this.handleError(err));
  }

  getRecords(): Observable<Task[]> {
    return this.http
      .get(this.url + "results/ten-latests-results/")
      .map(res => { let data = this.extractData(res); return data.reverse() }
      )
      .catch(err => this.handleError(err));
  }

  private extractData(res: Response) {
    if (res.status < 200 || res.status >= 300) {
      throw new Error("Bad response status: " + res.status);
    }
    let body = res.json();
    console.log("body", body);
    return body || {};
  }

  private handleError(error: any) {
    let errMsg = error.message || "Server error";
    console.error("error in service.handelError", errMsg); // log to console instead
    return Observable.throw(errMsg);
  }
}
