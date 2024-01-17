import { Accessor, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { createStore } from "solid-js/store";

const ALIVE_RATIO = 0.15 as const;

type BuildCellMode = "random" | "inherit";
type BuildCellParams = BuildCellMode extends "inherit"
  ? [BuildCellMode, number, number, number, boolean]
  : [BuildCellMode, number, number, number, boolean?];

const randomChoice = () => (Math.random() + (0.5 - ALIVE_RATIO) > 0.5 ? false : true);
/**
 * builda cell
 * init fn
 * @returns
 */
const buildCell = (...args: BuildCellParams): Cell => {
  const [mode, x, y, width, isAlive = false] = args;
  let alive = isAlive;
  if (mode === "random") alive = randomChoice();
  if (mode === "inherit") alive = isAlive;
  if (!mode) throw new Error("mode is not defined");
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

  const newGrid = (mode: BuildCellMode) => {
    const grid = Array.from({ length: nbrRows }, (_, i) =>
      Array.from({ length: nbrCols }, (_, j) => {
        const x = i * cellWidth;
        const y = j * cellWidth;
        return buildCell(mode, x, y, cellWidth);
      })
    );
    return grid;
  };

  /**
   * Mounting the grid & use buildCell and randomize the cells
   * init fn
   */
  onMount(() => {
    newGrid("random");
    console.log("nbr of cells", nbrOfCells);
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
        ctx.fillStyle = cell.isAlive ? cellColor() : "black";
        ctx.fillRect(cell.x, cell.y, cell.width, cell.width);
      });
    });
  };

  const cellColor = () => {
    let color = "white";
    const random = Math.random() * 100;
    if (random <= 25) color = "#3B82F6";
    if (random > 25 && random <= 50) color = "#6366F1";
    if (random > 50 && random <= 75) color = "#EC4899";
    if (random > 75) color = "#F59E0B";
    return color;
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

    for (let offsetRow = -1; offsetRow <= 1; offsetRow++) {
      for (let offsetCol = -1; offsetCol <= 1; offsetCol++) {
        if (row + offsetRow < 0 || row + offsetRow >= colLength) continue;
        if (col + offsetCol < 0 || col + offsetCol >= rowLength) continue;
        if (offsetRow === 0 && offsetCol === 0) continue;
        if (grid.grid[row + offsetRow][col + offsetCol].isAlive) aliveNeighbors++;
      }
    }
    return aliveNeighbors;
  };

  /**
   * Evolve the cell chain fn
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

    const gridLength = grid.grid.length;
    const rowLength = grid.grid[0].length;
    const nextGrid = newGrid("inherit");

    for (let row = 0; row < gridLength; row++) {
      for (let col = 0; col < rowLength; col++) {
        const cell = grid.grid[row][col];
        const neighbors = countAliveNeighbors(row, col);
        const isAlive = judgement(cell, neighbors);
        nextGrid[row][col].isAlive = isAlive;
      }
    }
    setGrid("grid", nextGrid);

    console.timeEnd("nextGen");

    setGenCount((prev) => prev + 1);
  };

  return [width, height, drawGrid, nextGen, genCount] as GameOfLife;
};
