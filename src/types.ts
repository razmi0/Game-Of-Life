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
  maxSpeed: number;
  minSpeed: number;
  clocked: boolean;
  tick: number;
  limiter: boolean;
  queue: number;
  changeMaxSpeed: (speed: number) => void;
  changeMinSpeed: (speed: number) => void;
  run: () => void;
  work: () => void;
  switchPlayPause: () => void;
  queueTicks: (ticks: number) => void;
  tuneSpeed: (speed: number) => void;
  changeSpeed: (addedSpeed: number) => void;
  switchClocked: () => void;
};

type ClockQueueTicksMode = "clocked" | "free";

type UserAgentInfo = {
  userAgent: string;
  battery: number | null;
  batteryChange: number;
  platform: string;
  hardwareConcurrency: number;
  deviceMemory: number;
  availableThreads: number;
};

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};

type DataStore = {
  generation: number;
  incrementGeneration: () => void;

  nAlive: number;
  setAlive: (value: number) => void;

  nDead: number;
  setDead: (value: number) => void;

  randomness: number;
  randomChoice: () => boolean;
  tuneRandom: (value: number) => void;
  changeRandom: (addedRandom: number) => void;
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
