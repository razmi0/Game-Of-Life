import { onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { cellColor, randomChoice } from "./helpers";
import { CELL_WIDTH } from "./data";
import type { Store } from "solid-js/store";
import type { Accessor } from "solid-js";

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

export default function useGameOfLife(screen: ScreenStoreState, ctx: Accessor<CanvasRenderingContext2D | undefined>) {
  const [board, setBoard] = createStore({
    grid: [] as GridType,
    generation: 0,
    build: (mode: BuildCellMode) => {
      const newGrid = Array.from({ length: screen.nRow() }, (_, i) =>
        Array.from({ length: screen.nCol() }, (_, j) => {
          const x = i * CELL_WIDTH;
          const y = j * CELL_WIDTH;
          return mode === "inherit"
            ? buildCell(mode, x, y, CELL_WIDTH, board.grid[i][j].isAlive)
            : buildCell(mode, x, y, CELL_WIDTH);
        })
      );
      return newGrid;
    },
    draw: () => {
      const context = ctx();
      if (!context) return;
      context.reset();
      board.grid.map((row) => {
        row.map((cell) => {
          context.fillStyle = cell.isAlive ? cellColor() : "black";
          context.fillRect(cell.x, cell.y, cell.width, cell.width);
        });
      });
    },
    nextGen: () => {
      const gridLength = board.grid.length;
      const rowLength = board.grid[0].length;
      const nextGrid = board.build("inherit");

      for (let row = 0; row < gridLength; row++) {
        for (let col = 0; col < rowLength; col++) {
          const cell = board.grid[row][col];
          const neighbors = board.countAliveNeighbors(row, col);
          const isAlive = board.judgement(cell, neighbors);
          nextGrid[row][col].isAlive = isAlive;
        }
      }
      setBoard("grid", nextGrid);
    },
    countAliveNeighbors: (row: number, col: number) => {
      let aliveNeighbors = 0;
      const rowLength = board.grid[0].length;
      const colLength = board.grid.length;

      for (let offsetRow = -1; offsetRow <= 1; offsetRow++) {
        for (let offsetCol = -1; offsetCol <= 1; offsetCol++) {
          if (row + offsetRow < 0 || row + offsetRow >= colLength) continue;
          if (col + offsetCol < 0 || col + offsetCol >= rowLength) continue;
          if (offsetRow === 0 && offsetCol === 0) continue;
          if (board.grid[row + offsetRow][col + offsetCol].isAlive) aliveNeighbors++;
        }
      }
      return aliveNeighbors;
    },
    judgement: (cell: Cell, count: number) => {
      let alive = cell.isAlive;
      if (cell.isAlive) {
        if (count < 2) alive = false; // underpopulation
        if (count > 3) alive = false; // overpopulation
      } else {
        if (count === 3) alive = true; // reproduction
      }
      return alive;
    },
    nextCycle: () => {
      console.time("nextCycle");
      board.nextGen();
      board.draw();
      setBoard("generation", board.generation + 1);
      console.timeEnd("nextCycle");
    },
  });

  onMount(() => setBoard("grid", board.build("random")));

  return board as Store<GridStoreState>;
}
