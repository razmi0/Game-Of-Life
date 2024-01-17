import { Accessor, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { createStore } from "solid-js/store";

const ALIVE_RATIO = 0.15 as const;
const TIME_STEP = 1000 as const;

/**
 * builda cell
 * init fn
 * @returns
 */
const buildCell = (x: number, y: number, width: number, isAlive?: boolean) => {
  const alive = isAlive ? isAlive : Math.random() + (0.5 - ALIVE_RATIO) > 0.5 ? false : true;
  return {
    x,
    y,
    width,
    isAlive: alive,
  };
};

type GameOfLife = readonly [
  Accessor<number>,
  Accessor<number>,
  (ctx: CanvasRenderingContext2D) => void,
  () => void,
  Accessor<number>
] & {};
export const useGameOfLife = (cellWidth: number) => {
  const [genCount, setGenCount] = createSignal(0);
  const [width, setWidth] = createSignal(window.innerWidth);
  const [height, setHeight] = createSignal(window.innerHeight);
  const [grid, setGrid] = createStore<GridType>({
    grid: [],
  });

  createEffect(() => {
    const cb = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };
    window.addEventListener("resize", cb);
    onCleanup(() => window.removeEventListener("resize", cb));
  });

  const nbrRows = Math.floor(width() / cellWidth);
  const nbrCols = Math.floor(height() / cellWidth);
  const nbrOfCells = Math.floor(width() / cellWidth) * Math.floor(height() / cellWidth);

  /**
   * Mounting the grid & use buildCell and randomize the cells
   * init fn
   */
  onMount(() => {
    console.time("onMount building grid");
    const grid = Array.from({ length: nbrRows }, (_, i) =>
      Array.from({ length: nbrCols }, (_, j) => buildCell(i * cellWidth, j * cellWidth, cellWidth))
    );
    setGrid("grid", grid);
    console.timeEnd("onMount building grid");
  });

  /**
   * Loop through the grid and draw the cells
   * leaf fn
   * @param ctx
   */
  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    ctx.reset();
    grid.grid.map((row) => {
      row.map((cell) => {
        ctx.fillStyle = cell.isAlive ? "transparent" : "black";
        ctx.fillRect(cell.x, cell.y, cell.width, cell.width);
      });
    });
  };

  /**
   * Count the neighbors of a cell ( 8 )
   * chain fn
   * @returns number
   */
  const countAliveNeighbors = (row: number, col: number) => {
    let aliveNeighbors = 0;
    const rowLength = grid.grid[0].length;
    const colLength = grid.grid.length;

    for (let k = -1; k <= 1; k++) {
      for (let l = -1; l <= 1; l++) {
        if (row + k < 0 || row + k >= colLength) continue;
        if (col + l < 0 || col + l >= rowLength) continue;
        if (k === 0 && l === 0) continue;
        if (grid.grid[row + k][col + l].isAlive) aliveNeighbors++;
      }
    }
    return aliveNeighbors;
  };

  /**
   * Evolve the cell into alive or dead
   * chain fn
   */
  const judgement = (cell: Cell, count: number) => {
    let alive = cell.isAlive;
    if (cell.isAlive) {
      if (count < 2) alive = false; // underpopulation
      if (count > 3) alive = false; // overpopulation
    } else {
      if (count === 3) alive = true; // reproduction
    }
    return alive;
  };

  /**
   * Next generation
   * mutate fn
   * @returns void
   */
  const nextGen = () => {
    console.time("nextGen");
    for (let row = 0; row < grid.grid.length; row++) {
      for (let col = 0; col < grid.grid[0].length; col++) {
        const neighbors = countAliveNeighbors(row, col);
        const isAlive = judgement(grid.grid[row][col], neighbors);
        setGrid("grid", [row], [col], "isAlive", isAlive);
      }
    }
    console.timeEnd("nextGen");
    setGenCount((prev) => prev + 1);
  };

  return [width, height, drawGrid, nextGen, genCount] as GameOfLife;
};
