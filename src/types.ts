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
type BuildCellParams =
  | [mode: "random", x: number, y: number, width: number]
  | [mode: "inherit", x: number, y: number, width: number, isAlive: boolean];
type ScreenStoreState = {
  width: number;
  height: number;
  nRow: () => number;
  nCol: () => number;
  nCell: () => number;
  updateScreen: () => void;
};

type GridStoreState = {
  grid: GridType;
  generation: number;
  build: () => GridType;
  draw: () => void;
  nextGen: () => void;
  reset: () => void;
  resize: () => void;
  countAliveNeighbors: (row: number, col: number) => number;
  judgement: (cell: Cell, neighbors: number) => boolean;
  nextCycle: () => void;
};
type BuildCellMode = "random" | "inherit";

type CanvasProps = {
  screen: ScreenStoreState;
};
