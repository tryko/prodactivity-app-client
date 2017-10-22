import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router'

import { TaskService } from '../../services/task.service';



@Component({
  selector: 'priming-stage',
  template: `
  <h1></h1>
  <div #primingStage >
    <button mat-button (click)="onThinkingStart()"><b>Thinking of starting</b></button>
    <button mat-button color="primary" (click)="onStartTask()"><b>Start Task</b></button>
    <div class="horizontalLayout">
      <div class="divMargin" *ngFor="let i of thoughtsToStart">
        <h2> - </h2>
      </div>
    </div>
  </div>
  `,
  styleUrls: ['./priming-stage.component.css']
})
export class PrimingStageComponent implements OnInit {

  errorMSG: string = '';
  thoughtsToStart = [];

  constructor(private taskService: TaskService, private router: Router) {
  }

  ngOnInit() {
  }

  onThinkingStart() {
    this.thoughtsToStart.push('-')
    this.taskService.updateThinkingOfStarting(new Date().getTime())
  }
  
  onStartTask() {
    this.taskService.updateStage(new Date().getTime(),false,"workStageInitialState")
      .subscribe(res => {
        this.router.navigate(['/working-on-task'], { skipLocationChange: true });
      },
      error => { this.errorMSG = error; })

  }

}

// work on taskStage:
// 1) change onStartTask to work with service, post data.