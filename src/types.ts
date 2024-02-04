type Cell = {
  x: number;
  y: number;
  width: number;
  isAlive: boolean;
  color: string;
};

type GridType = Cell[][];

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

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

type ScreenStoreState = {
  width: number;
  height: number;
  nRow: () => number;
  nCol: () => number;
  nCell: () => number;
  updateScreen: () => void;
};

type DataStore = {
  generation: number;
  incrementGeneration: () => void;

  nAlive: number;
  setAlive: (value: number) => void;

  nAliveIncrease: boolean;
  switchAliveIncrease: () => void;

  nDead: number;
  setDead: (value: number) => void;

  nDeadIncrease: boolean;
  switchDeadIncrease: () => void;

  randomness: number;
  randomChoice: () => boolean;
  setRandom: (value: number) => void;
};

// type GridStoreState = {
//   grid: GridType;
//   generation: number;
//   nAlive: number;
//   nAliveIncrease: boolean;
//   nDead: number;
//   nDeadIncrease: boolean;
//   randomness: number;
//   randomChoice: () => boolean;
//   shuffle: () => void;
//   build: (random: boolean) => GridType;
//   draw: () => void;
//   nextGen: () => void;
//   reset: () => void;
//   changeRandomness: (value: number) => void;
//   initHash: () => Uint8Array;
//   updateHash: () => void;
//   // resize: () => void;
//   countAliveNeighbors: (row: number, col: number) => number;
//   judgement: (cell: Cell, neighbors: number) => boolean;
//   nextCycle: () => void;
// };
