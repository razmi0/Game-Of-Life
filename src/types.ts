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
  playPause: () => void;
  run: () => void;
  addTick: () => void;
  changeSpeed: (speed: number) => void;
  addSpeed: () => void;
  subSpeed: () => void;
};
