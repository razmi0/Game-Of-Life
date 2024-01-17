type Cell = {
  x: number;
  y: number;
  width: number;
  isAlive: boolean;
};

type GridType = {
  grid: Cell[][];
};

type ClockState = {
  play: boolean;
  speed: number;
  tick: number;
  clocked: boolean;
  limiter: boolean;
  queue: number;
  playPause: () => void;
  run: () => void;
  work: () => void;
  changeSpeed: (speed: number) => void;
  switchClocked: () => void;
  addSpeed: () => void;
  subSpeed: () => void;
  queueTicks: (ticks: number) => void;
};
