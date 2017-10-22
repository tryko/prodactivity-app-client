import { BrowserModule } from "@angular/platform-browser";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { RouterModule, Routes } from "@angular/router";
import { MatCardModule, MatButtonModule, MatDialogModule, MatDialogRef } from "@angular/material";

import { ResultsService } from "./services/results.service";
import { TaskService } from "./services/task.service";

import { AppComponent } from "./app.component";
// import { ManagerComponent } from './components/manager/manager.component';
import { PrimingStageComponent } from "./components/priming-stage/priming-stage.component";
import {
  WorkStageComponent,
  StopTaskDialog
} from "./components/work-stage/work-stage.component";
import { StatisticsManagerComponent } from "./components/statistics-manager/statistics-manager.component";
import { HomeComponent } from "./components/home/home.component";
import { LastTaskStatsComponent } from "./components/statistics-manager/last-task-stats/last-task-stats.component";
import { TasksGraphComponent } from "./components/statistics-manager/tasks-graph/tasks-graph.component";

const appRoutes: Routes = [
  { path: "", component: HomeComponent },
  { path: "priming-stage", component: PrimingStageComponent },
  { path: "working-on-task", component: WorkStageComponent },
  { path: "results", component: StatisticsManagerComponent }
  // { path: '', component: StatisticsManagerComponent },
];

@NgModule({
  declarations: [
    AppComponent,
    PrimingStageComponent,
    WorkStageComponent,
    StopTaskDialog,
    StatisticsManagerComponent,
    HomeComponent,
    LastTaskStatsComponent,
    TasksGraphComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    MatButtonModule,MatDialogModule,MatCardModule,
    RouterModule.forRoot(appRoutes)
  ],
  entryComponents: [StopTaskDialog],
  providers: [TaskService, ResultsService],
  bootstrap: [AppComponent]
})
export class AppModule {}

// going to change the data model and the way i make request.
