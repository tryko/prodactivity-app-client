import { Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material";
import { Router } from "@angular/router";
import { TaskService } from "../../services/task.service";
import { stageTypes } from "../../model/taskSessions.model";

@Component({
  selector: "work-stage",
  template: `
  <div #taskStage>
    <button mat-button (click)="onThinkingOfStopingTask()"><b>Thinking of stopping</b></button>
    <button mat-button color="primary" (click)="onStopTask()"><b>Stopped</b></button>
    <button mat-button color="primary" (click)="onFinishTask(true)"><b>Finished Task</b></button>
    <div class="horizontalLayout">
      <div class="divMargin" *ngFor="let i of thoughtsToStop">
        <h2> + </h2>
      </div>
    </div>
  </div>
  `,
  styleUrls: ["./work-stage.component.css"]
})
export class WorkStageComponent implements OnInit {
  errorMSG: string = "";
  thoughtsToStop = [];

  constructor(
    public dialog: MatDialog,
    private taskService: TaskService,
    private router: Router
  ) {}

  ngOnInit() {}

  onThinkingOfStopingTask() {
    this.thoughtsToStop.push("+");
    this.taskService.updateThinkingOfStoping(new Date().getTime());
  }

  onStopTask() {
    let dialogRef = this.dialog.open(StopTaskDialog);
  }

  onFinishTask(isFinished: boolean) {
    this.taskService
      .updateStage(new Date().getTime(), true)
      .subscribe(res =>
        this.router.navigate(["/results"], { skipLocationChange: true })
      );
  }
}

@Component({
  selector: "stop-task-dialog",
  template: `
    <div mat-dialog-actions>
      <button mat-button (click)="dialogRef.close('temp stop')">Temporary stop</button>
      <button mat-button (click)="dialogRef.close('task')">Back to the task</button>
      <button mat-button (click)="dialogRef.close('reschedule')">Reschedule</button>
      <button mat-button (click)="dialogRef.close('quit task')">Quit task</button>   
    </div> 
  `
})
export class StopTaskDialog {
  constructor(
    public dialogRef: MatDialogRef<StopTaskDialog>,
    router: Router,
    taskService: TaskService
  ) {
    dialogRef.afterClosed().forEach(result => {
      console.log("dd");
      if (result === "temp stop") {
        // add taskSession
        taskService
          .updateStage(new Date().getTime(), false, "primingStageInitialState")
          .subscribe(res =>
            router.navigate(["/priming-stage"], { skipLocationChange: true })
          );
      } else if (result === "task") {
        //return to the current work-stage
      } else if (result === "reschedule") {
        // change the task to be rescheduled but keep it finished status unchanged
      } else if (result === "quit task") {
        console.log("rr");
        taskService
          .updateStage(new Date().getTime(), false)
          .subscribe(res =>
            router.navigate(["/results"], { skipLocationChange: true })
          );
      }
    });
  }
}
