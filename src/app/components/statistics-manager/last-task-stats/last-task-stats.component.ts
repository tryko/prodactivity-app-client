import { ResultsService } from "./../../../services/results.service";
import { Observable } from "rxjs";
import { Task } from "./../../../model/task.model";
import { Component, OnInit, Input, ElementRef, ViewChild } from "@angular/core";

import * as d3 from "d3";

@Component({
  selector: "last-task-stats",
  template: `
    <div *ngIf="latestRecord">
      <h2>{{latestRecord.taskName}} </h2> 
      <h3> Total time :{{totalTaskDuration()}} End Time: {{endTime}}</h3>
      <h3> Total work time: {{totalWorkTime()}}</h3>
    </div>
    <svg #chart [attr.width.px]="chartWidth" [attr.height.px]="chartHeight"></svg>
    <ng-template #loading> Loading latest task</ng-template>
  `,
  styleUrls: ["./last-task-stats.component.css"]
})
export class LastTaskStatsComponent implements OnInit {
  @ViewChild("chart") chart: ElementRef;

  chartWidth:number = 900
  chartHeight:number = 200
  taskSessionSize: number = 0;
  totalTimeMS: number = 0;
  totalWorkTimeMS:number = 0;
  endTime = "";

  @Input() latestRecord;
  constructor() { }

  ngOnInit() {
    console.log("this.latestRecord", this.latestRecord);
    this.taskSessionSize = this.latestRecord.taskSessions.length - 1;
    this.latestRecord.taskSessions.forEach((stage,index) => { this.totalTimeMS = this.totalTimeMS + stage.totalTime;
    if(index%2 === 1){this.totalWorkTimeMS = this.totalWorkTimeMS + stage.totalTime} })
    this.endTime = this.getTimeOfDay(this.latestRecord.initTaskTime + this.totalTimeMS);
    this.chartBuilder();
  }

  totalTaskDuration() {
   return this.timeInMSToHour(this.totalTimeMS);
  }

  totalWorkTime(){
   return this.timeInMSToHour(this.totalWorkTimeMS);
   
  }
  chartBuilder() {
    let gapBetweenStage = 330;
    let rangeEnd = this.chartWidth - gapBetweenStage;
    const data = this.latestRecord.taskSessions;
    const totalTime = this.latestRecord.taskSessions.reduce((sum, value) => {
      ;
      return sum + value.totalTime
    }, 0)
    console.log('s', totalTime)


    const xScale = d3
      .scaleLinear()
      .domain([
        this.latestRecord.taskSessions[0].initTime,
        this.latestRecord.taskSessions[
          this.latestRecord.taskSessions.length - 1
        ].initTime
      ])
      .range([0, rangeEnd]);

    const widthScale = d3.scaleLinear().domain([0, totalTime]).range([0, rangeEnd - 36]);

    let svg = d3.select(this.chart.nativeElement);
    svg
      .selectAll("rect")
      .data(data)
      .enter()
      .append("rect")
      .attr("height", 50)
      .attr("x", d => xScale(d["initTime"]))
      .attr("width", (d, i) => widthScale(data[i].totalTime))
      .attr("fill",(d,i) =>  {return i%2===0? "#66ccff":"#99ff66"})
      .attr("stroke", "grey")
      .attr("stroke-width", 1);

    svg
      .selectAll("text")
      .data(data)
      .enter()
      .append("text")
      .attr("x", d => xScale(d["initTime"]))
      .attr("y", 65)
      .text(d => this.getTimeOfDay(d["initTime"]))
      .style("font-size","10px");
  }
  //-----------------utility------------------//
  timeInMSToHour(timeInMS){
    const date = new Date(timeInMS);
    let totalTimeArr = [];
    totalTimeArr.push(date.getHours() - 2);
    totalTimeArr.push(date.getMinutes());
    totalTimeArr.push(date.getSeconds());

    if (totalTimeArr[0] < 10) {
      totalTimeArr[0] = "0" + totalTimeArr[0];
    }
    if (totalTimeArr[1] < 10) {
      totalTimeArr[1] = "0" + totalTimeArr[1];
    }
    if (totalTimeArr[2] < 10) {
      totalTimeArr[2] = "0" + totalTimeArr[2];
    }
    return totalTimeArr.join(":");
  }

  getTimeOfDay(timeInMS) {
    let hour = new Date(timeInMS).toString().slice(16, -18);
    return hour;
  }
}

/* things to do: get last 10 tasks
 * show how much time the last task took, and each stage took.
 */

// let svg = d3.select(this.chart.nativeElement);
//     let margin = { top: 10, right: 10, bottom: 10, left: 10 };
//     let height = this.chartHeight - margin.top - margin.bottom;
//     let width = this.chartWidth - margin.left - margin.right;
//     svg.attr("height", this.chartHeight);
//     svg.attr("width", this.chartWidth);

//     let y = d3.scaleLinear().rangeRound([height, 0]);
//     let x = d3.scaleBand().rangeRound([0, width]).padding(0);

//     let g = svg
//       .append("g")
//       .attr("transform", "translate(" + margin.top + "," + margin.left + ")");

//     x.domain(this.dataSet.map(d => d.x));
//     y.domain([0, d3.max(this.dataSet, d => d.y)]);

//     g
//       .append("g")
//       .selectAll(".bar")
//       .data(this.dataSet)
//       .enter()
//       .append("rect")
//       .attr("class", "bar")
//       .attr("x", function(d) {
//         return x(d.x);
//       })
//       .attr("y", function(d) {
//         return y(d.y);
//       })
//       .attr("width", x.bandwidth())
//       .attr("height", function(d) {
//         return height - y(d.y);
//       })
//       .attr("fill", function(d: any) {
//         return "hsl(" + Math.random() * 360 + ", 100%, 50%)";
//       })
//       .on("mouseover", mouseover)
//       .on("mousemove", function(d) {
//         mousemove(d.x, d.y);
//       })
//       .on("mouseout", mouseout);

//     var div = d3
//       .select("body")
//       .append("div")
//       .attr("class", "tooltip")
//       .style("display", "none");

//     function mouseover() {
//       div.style("display", "inline");
//     }

//     function mousemove(x, y) {
//       div
//         .text(x + ": " + y)
//         .style("left", d3.event.pageX - 34 + "px")
//         .style("top", d3.event.pageY - 12 + "px");
//     }

//     function mouseout() {
//       div.style("display", "none");
//     }

// this will show the time it took for each stage to finish
// so first get the total time. [X]

// added D3, next i need to use data from latest record to display
