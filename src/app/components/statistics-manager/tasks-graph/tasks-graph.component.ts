import { Task } from "./../../../model/task.model";
import { Component, OnInit, Input, ViewChild, ElementRef } from "@angular/core";
import * as d3 from "d3";

@Component({
  selector: "tasks-graph",
  template: `
    <div *ngIf="latestTasks">
      here will be a graph showing tasks.
      </div>
      <svg #recordsChart [attr.width.px]="svgWidth" [attr.height.px]="svgHeight"></svg>
      <ng-template #loading> Loading latest task</ng-template>
      
  `,
  styleUrls: ["./tasks-graph.component.css"]
})
export class TasksGraphComponent implements OnInit {
  @ViewChild("recordsChart") chart: ElementRef;

  private svgWidth = 900;
  private svgHeight = 600;
  private GbS = 2; // gap between stages
  private GbGS = 50; // gap between groups of stages
  private stagesInGroups = [];
  private toalStages = 0;
  private sizeOfStage = 0;
  private sizeOfGroups = [];
  @Input() latestTasks: Task[];

  constructor() {}

  ngOnInit() {
    this.stagesInGroups = this.latestTasks.map(v => v.taskSessions.length);
    this.toalStages = this.stagesInGroups.reduce((s, v) => s + v, 0);
    this.sizeOfGroups = this.getSizesOFGroups();
    this.sizeOfStage = this.getStageSize();
    console.log("size of stage", this.sizeOfStage);
    this.chartBuilder();
  }

  private getTaskTotalTime(lastStage): number {
    return lastStage.initTime + lastStage.totalTime;
  }

  private getLongestStage() {
    return this.latestTasks
      .map(task => {
        return task.taskSessions.reduce((curLongestStage, value) => {
          return curLongestStage > value.totalTime
            ? curLongestStage
            : value.totalTime;
        }, 0);
      })
      .reduce((taskDuration, prevValue) => {
        return taskDuration > prevValue ? taskDuration : prevValue;
      }, 0);
  }

  // return an array of size of groups relative to the svgWidth
  getSizesOFGroups() {
    const groupRatios = this.stagesInGroups.map(v => v / this.toalStages);
    const numOfSpacesBetweenGroups = this.latestTasks.length - 1;
    const sizeOfGroups = groupRatios.map(v =>
      Math.floor(v * (this.svgWidth - this.GbGS * numOfSpacesBetweenGroups))
    );
    return sizeOfGroups;
  }

  /* get the size of a stage based on this.sizeOfGroups */
  private getStageSize() {
    return Math.floor(
      (this.sizeOfGroups[0] -
        this.GbS * (this.latestTasks[0].taskSessions.length - 1)) /
        this.latestTasks[0].taskSessions.length
    );
  }

  cumulativeXpos(values, gaps) {
    const cumulativeResult = [0];
    for (let i = 1; i < values.length; i++) {
      cumulativeResult[i] = cumulativeResult[i - 1] + values[i - 1] + this.GbGS;
    }
    return cumulativeResult;
  }

  private chartBuilder() {
    const data = this.latestTasks;
    const longestTask = this.getLongestStage();
    const heightScale = d3
      .scaleLinear()
      .domain([0, longestTask])
      .range([0, this.svgHeight - 100]);
    const cunmulativeGroupXPos = this.cumulativeXpos(
      this.sizeOfGroups,
      this.GbGS
    );

    let svg = d3.select(this.chart.nativeElement);
    const g = svg.append("g");

    g
      .append("g")
      .selectAll("g")
      .data(data)
      .enter()
      .append("g")
      .attr(
        "transform",
        (d, i) => "translate(" + cunmulativeGroupXPos[i] + ",0)"
      )
      .selectAll("rect")
      .data(d => d.taskSessions)
      .enter()
      .append("rect")
      .attr("x", (d, i) => i * this.GbS + i * this.sizeOfStage)
      .attr("width", this.sizeOfStage)
      .attr("y", d => this.svgHeight - heightScale(d.totalTime))
      .attr("height", d => heightScale(d.totalTime))
      .attr("fill", "green")
      .attr("stroke", "grey");
    console.log("svg", svg);
  }
}
