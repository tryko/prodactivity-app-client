export interface Task {
  taskName: string;
  isFinished: boolean;
  initTaskTime: number;
  taskSessions: any[];
}

export function taskInitialState(): Task {
  return {
    taskName: "no assigned name",
    isFinished: false,
    initTaskTime: 0,
    taskSessions: []
  };
}

// what data will latest task show?
// latestData: show how many clicks till start task, how many clicks overcoming wanting to
// stop, num of task sessions is how many time stoped task.
// show how much time priming , how much time at the task.
