import { createEffect, createSignal, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import { randomColor, randomChoice, screenChange } from "./helpers";
import { CELL_WIDTH } from "./data";
import type { Store } from "solid-js/store";
import type { Accessor } from "solid-js";

export default function useGameOfLife(screen: ScreenStoreState, ctx: Accessor<CanvasRenderingContext2D | undefined>) {
  const [board, setBoard] = createStore({
    grid: [] as GridType,
    generation: 0,

    /**
     * Build grid (no drawing, no setter) random if undefined
     */
    build: (random: boolean = false) => {
      console.time("build");
      const newGrid = Array.from({ length: screen.nRow() }, (_, i) =>
        Array.from({ length: screen.nCol() }, (_, j) => {
          const x = i * CELL_WIDTH;
          const y = j * CELL_WIDTH;
          const isAlive = random ? randomChoice() : board.grid[i]?.[j]?.isAlive ?? randomChoice();
          const color = random ? randomColor() : board.grid[i]?.[j]?.color ?? randomColor();
          return {
            x,
            y,
            width: CELL_WIDTH,
            isAlive: isAlive,
            color: color,
          };
        })
      );
      console.timeEnd("build");
      return newGrid;
    },

    /**
     * Reset canvas
     */
    reset: () => {
      setBoard("grid", board.build());
      setBoard("generation", 0);
      board.draw();
    },

    // resize: () => {
    //   createEffect<[number, number]>(
    //     (prev) => {
    //       const size = [screen.width, screen.height];
    //       if (prev[0] === size[0] && prev[1] === size[1]) return prev;

    //       const widthChange = screenChange(prev[0], size[0]);
    //       const heightChange = screenChange(prev[1], size[1]);

    //       /** width */
    //       switch (widthChange) {
    //         case "decrease":
    //           console.log("width decrease");
    //           break;
    //         case "increase":
    //           console.log("width increase");
    //           break;
    //         case "no change":
    //           break;
    //       }

    //       /** height */
    //       switch (heightChange) {
    //         case "decrease":
    //           console.log("height decrease");
    //           break;
    //         case "increase":
    //           console.log("height increase");
    //           break;
    //         case "no change":
    //           break;
    //       }

    //       setBoard("grid", board.build("inherit"));
    //       board.draw();

    //       return [screen.width, screen.height];
    //     },
    //     [screen.width, screen.height]
    //   );
    // },

    /**
     * Draws the grid on the canvas
     * @returns void
     */
    draw: () => {
      const context = ctx();
      if (!context) return;
      context.reset();
      board.grid.map((row) => {
        row.map((cell) => {
          context.fillStyle = cell.isAlive ? cell.color : "black";
          context.fillRect(cell.x, cell.y, cell.width, cell.width);
        });
      });
    },

    /**
     * Generates the next generation with build, countAliveNeighbors, judgement and setBoard
     */
    nextGen: () => {
      const gridLength = board.grid.length;
      const rowLength = board.grid[0].length;
      const nextGrid = board.build();

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

    /**
     * Counts the number of alive neighbors
     * @param row : number
     * @param col : number
     * @returns number
     */
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

    /**
     * Applies the rules of the game
     * @param cell : Cell
     * @param count  : number
     * @returns boolean
     */
    judgement: (cell: Cell, count: number) => {
      let alive = cell.isAlive;
      if (cell.isAlive) {
        // underpopulation
        if (count < 2) alive = false;
        // overpopulation
        if (count > 3) alive = false;
      } else {
        // reproduction
        if (count === 3) alive = true;
      }
      return alive;
    },

    /**
     * Draws the next generation and increments the generation counter
     */
    nextCycle: () => {
      console.time("nextGen");
      board.nextGen();
      console.timeEnd("nextGen");
      console.time("draw");
      board.draw();
      console.timeEnd("draw");
      setBoard("generation", board.generation + 1);
    },
  });

  onMount(() => {
    setBoard("grid", board.build());
  });

  return board as Store<GridStoreState>;
}
