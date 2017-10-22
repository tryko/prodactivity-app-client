import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

import { TaskService } from '../../services/task.service';

@Component({
  selector: 'home',
  template: `
  <mat-card>
    <mat-card-title>Enter a Task</mat-card-title>
      <mat-card-content>
        <mat-input-container>
          <input mdInput placeholder="Enter task you wish to complete" [formControl]="taskName">
        </mat-input-container>
        <button mat-button (click)="onTaskName()"> Lets start</button>
      </mat-card-content>
    </mat-card>
    <div *ngIf="errorMessage"> {{errorMessage}} </div>
  `,
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  errorMSG:string = '';
  taskName: FormControl = new FormControl();

  constructor(private taskService: TaskService, private router: Router) {
  }

  ngOnInit() {

  }

  onTaskName() {
    this.taskService.makeNewTask(this.taskName.value, new Date().getTime())
      .subscribe(res => {
        console.log('res',res);
        // res holds status if added.
        this.router.navigate(['/priming-stage'], { skipLocationChange: true });
      }),
      error =>  {console.log('error from component home.onTaskName');this.errorMSG = <any>error; }
  }
}

/* things to do:
   A. need to test adding task name, working and with error.
 */

