interface PrimingStage {
  initTime: number;
  totalTime: number;
  thoughtsToStart: number[];
}

function primingStageInitialState(): PrimingStage {
  return {
    initTime: 0,
    totalTime: 0,
    thoughtsToStart: []
  };
}

interface WorkStage {
  initTime: number;
  totalTime: number;
  stopThoughts: number[];
}

function workStageInitialState(): WorkStage {
  return {
    initTime: 0,
    totalTime: 0,
    stopThoughts: []
  };
}


export const stageTypes = {
  workStageInitialState: workStageInitialState(),
  primingStageInitialState: primingStageInitialState()
};
