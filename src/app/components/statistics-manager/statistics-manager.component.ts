import { Observable } from "rxjs";
import { Task } from "./../../model/task.model";
import { ResultsService } from "./../../services/results.service";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "statistics-manager",
  template: `
    <div *ngIf="tenLatestsTasks | async ;let tenLatestsRecords; else loading">
      <tasks-graph [latestTasks] = "tenLatestsRecords"></tasks-graph>
    </div>  
    <div *ngIf="latestTask | async ;let latestRecord; else loading">
        <last-task-stats [latestRecord] = "latestRecord"></last-task-stats>
     </div>
    
    <ng-template #loading>Loading</ng-template>
  `,
  styleUrls: ["./statistics-manager.component.css"]
})
export class StatisticsManagerComponent implements OnInit {
  latestTask: Observable<Task>;
  tenLatestsTasks: Observable<Task[]>;
  constructor(private resultsService: ResultsService) {
    this.tenLatestsTasks = this.resultsService.getRecords();
    this.latestTask = this.resultsService.getLatestRecord();
  }

  ngOnInit() {}
}

// i have latest task data showing
// next graph shows first priming compared to previous first priming
// 1) create data.
