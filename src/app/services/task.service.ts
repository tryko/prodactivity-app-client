import { Router } from "@angular/router";
import { Observable } from "rxjs";
import 'rxjs/add/operator/catch'
import { Injectable } from "@angular/core";
import { Http, Headers, RequestOptions, Response } from "@angular/http";
import { BehaviorSubject } from "rxjs/BehaviorSubject";

import "rxjs/add/operator/publishLast";
import "rxjs/add/operator/map";

import { Task, taskInitialState } from "../model/task.model";
import { stageTypes } from "../model/taskSessions.model";

@Injectable()
export class TaskService {
  currentTask: Task = taskInitialState();
  
  private taskID;
  private url = "http://localhost:3000/";
  constructor(private http: Http) {}

  makeNewTask(name: string, taskCreationTime: number): Observable<any> {
    console.log('in make new task')
    this.currentTask = taskInitialState();
    this.currentTask.taskName = name;
    this.currentTask.initTaskTime = new Date().getTime();
    let headers = new Headers({ "Content-Type": "application/json" });
    let options = new RequestOptions({ headers: headers });
    return this.http
      .post(this.url, this.currentTask, options)
      .map(res => {
        console.log("task creation", this.currentTask);
        this.taskID = this.extractData(res).id;
        const newPrimingStage = stageTypes.primingStageInitialState;
        newPrimingStage.initTime = taskCreationTime;
        this.currentTask.taskSessions.push(newPrimingStage);
        console.log("first priming", this.currentTask);
      })
      .catch(err => this.handleError(err));
  }

  updateThinkingOfStarting(date: number) {
    this.currentTask.taskSessions[this.getTaskLength()].thoughtsToStart.push(
      date
    );
  }

  updateThinkingOfStoping(date: number) {
    this.currentTask.taskSessions[this.getTaskLength()].stopThoughts.push(date);
  }

  updateStage(date: number, isDone: boolean = false, stageType: string = "") {
    const objToUpdate = [];

    if (isDone) {
      this.currentTask.isFinished;
      this.addTotalTimeToStage(date);

      objToUpdate.push(
        this.objCreater(this.currentTask.isFinished, "isFinished", "$set")
      );

      objToUpdate.push(
        this.objCreater(
          this.currentTask.taskSessions[this.getTaskLength()],
          "taskSessions",
          "$push"
        )
      );
    } else {
      this.addTotalTimeToStage(date);

      objToUpdate.push(
        this.objCreater(
          this.currentTask.taskSessions[this.getTaskLength()],
          "taskSessions",
          "$push"
        )
      );
      if (stageType !== "") {
        const newStage = stageTypes[stageType];
        newStage.initTime = date;
        this.currentTask.taskSessions.push(newStage);
      }
    }

    console.log(this.currentTask);
    return this.updateSession(objToUpdate, "update-stage/" + this.taskID);
  }

  /*----------------------------------------------------------------------- */

  private updateSession(data: object, urlAddon: string): Observable<any> {
    console.log("updating session");
    let headers = new Headers({ "Content-Type": "application/json" });
    let options = new RequestOptions({ headers: headers });
    return this.http
      .put(this.url + urlAddon, data, options)
      .map(res => this.extractData(res))
      .catch(err => this.handleError(err));
  }

  private getTaskLength() {
    return this.currentTask.taskSessions.length - 1;
  }

  private objCreater(data, taskParm, dbActionType) {
    return {
      data: data,
      taskParm: taskParm,
      dbActionType: dbActionType
    };
  }
  private addTotalTimeToStage(date: number) {
    this.currentTask.taskSessions[this.getTaskLength()].totalTime =
      date - this.currentTask.taskSessions[this.getTaskLength()].initTime;
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
