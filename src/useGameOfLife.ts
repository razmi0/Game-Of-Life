import { onMount, type Accessor } from "solid-js";
import { createStore, type Store } from "solid-js/store";
import { confirmTendency, randomColor } from "./helpers";
import { CELL_WIDTH, DEFAULT_RANDOMNESS, SHUFFLE_MAX_CONSECUTIVE_ALIVE, SHUFFLE_MAX_CONSECUTIVE_DEAD } from "./data";

export default function useGameOfLife(screen: ScreenStoreState, ctx: Accessor<CanvasRenderingContext2D | undefined>) {
  const [board, setBoard] = createStore({
    grid: [] as GridType,
    generation: 0,
    nAlive: 0,
    nAliveIncrease: false,
    nDead: 0,
    nDeadIncrease: false,
    randomness: DEFAULT_RANDOMNESS,

    /** first hash generation  */
    initHash: () => {
      const hash = new Uint8Array(screen.nCell());
      for (let i = 0; i < hash.length; i++) {
        hash[i] = board.randomChoice() ? 1 : 0;
      }
      return hash;
    },

    /** countNeighbord hash */
    /**
     *
     */
    updateHash: (hash: Uint8Array) => {
      console.time("updateHash");
      let i = 0;
      while (i < hash.length) {
        const center = hash[i] ?? 0;

        /** Count alive neighbors */

        const top = hash[i - screen.nRow()] ?? 0;
        const topRight = hash[i - screen.nRow() + 1] ?? 0;
        const right = hash[i + 1] ?? 0;
        const bottomRight = hash[i + screen.nRow() + 1] ?? 0;
        const bottom = hash[i + screen.nRow()] ?? 0;
        const bottomLeft = hash[i + screen.nRow() - 1] ?? 0;
        const left = hash[i - 1] ?? 0;
        const topLeft = hash[i - screen.nRow() - 1] ?? 0;

        const neighbors = top + topRight + right + bottomRight + bottom + bottomLeft + left + topLeft;

        /** Apply rules */

        if (center === 1) {
          // underpopulation
          if (neighbors < 2) hash[i] = 0;
          // overpopulation
          if (neighbors > 3) hash[i] = 0;
        } else {
          // reproduction
          if (neighbors === 3) hash[i] = 1;
        }

        i++;
      }
      console.time("updateHash");

      console.log("hash : ", hash);
    },

    // countAliveNeighbors: (row: number, col: number) => {
    //   let aliveNeighbors = 0;
    //   const rowLength = board.grid[0].length;
    //   const colLength = board.grid.length;

    //   for (let offsetRow = -1; offsetRow <= 1; offsetRow++) {
    //     for (let offsetCol = -1; offsetCol <= 1; offsetCol++) {
    //       if (row + offsetRow < 0 || row + offsetRow >= colLength) continue;
    //       if (col + offsetCol < 0 || col + offsetCol >= rowLength) continue;
    //       if (offsetRow === 0 && offsetCol === 0) continue;
    //       if (board.grid[row + offsetRow][col + offsetCol].isAlive) aliveNeighbors++;
    //     }
    //   }
    //   return aliveNeighbors;
    // },

    /**
     * Random choice
     */
    randomChoice: () => (Math.random() * 100 - board.randomness + 50 > 50 ? true : false),

    /**
     *
     */
    changeRandomness: (value: number /** range 0 - 100 */) => {
      setBoard("randomness", value);
      setBoard("grid", board.build(true));
      board.draw();
    },

    /**
     * Build grid (no drawing, no setter) random if undefined
     */
    build: (random: boolean = false) => {
      let alives = 0;
      let deads = 0;
      const newGrid = Array.from({ length: screen.nRow() }, (_, i) =>
        Array.from({ length: screen.nCol() }, (_, j) => {
          const x = i * CELL_WIDTH; // row number
          const y = j * CELL_WIDTH; // col number
          /** random or copy ?? random */
          const isAlive = random ? board.randomChoice() : board.grid[i]?.[j]?.isAlive ?? board.randomChoice();
          /** random or copy ?? random */
          const color = random ? randomColor() : board.grid[i]?.[j]?.color ?? randomColor();
          isAlive ? alives++ : deads++;
          return {
            x,
            y,
            width: CELL_WIDTH,
            isAlive: isAlive,
            color: color,
          };
        })
      );

      setBoard("nAliveIncrease", confirmTendency(alives > board.nAlive, "alive"));
      setBoard("nDeadIncrease", confirmTendency(deads > board.nAlive, "dead"));
      setBoard("nAlive", alives);
      setBoard("nDead", deads);
      return newGrid;
    },

    /**
     * Reset canvas
     */
    reset: () => {
      setBoard("grid", board.build(true));
      setBoard("generation", 0);
      board.draw();
    },

    /**
     * Shuffle a bit the grid based on arbitrary value of consecutive nature of cells (alive or dead)
     */
    shuffle: () => {
      console.time("shuffle");
      let consecutiveAlive = 0;
      let consecutiveDead = 0;
      let indexToChange = [] as [number, number, boolean][];

      for (let i = 0; i < board.grid.length; i++) {
        for (let j = 0; j < board.grid[i].length; j++) {
          if (board.grid[i]?.[j]?.isAlive) {
            consecutiveAlive++;
            consecutiveDead = 0;
          } else {
            consecutiveDead++;
            consecutiveAlive = 0;
          }
          if (consecutiveAlive > SHUFFLE_MAX_CONSECUTIVE_ALIVE) {
            const changeIndex = j - 1 < 0 ? j : j - 1;
            indexToChange.push([i, changeIndex, false]);
            consecutiveAlive = 0;
          }
          if (consecutiveDead > SHUFFLE_MAX_CONSECUTIVE_DEAD) {
            const changeIndex = j - 5 < 0 ? j : j - 5;
            indexToChange.push([i, changeIndex, true]);
            consecutiveDead = 0;
          }
        }
      }

      indexToChange.map(([row, col, newState]) => setBoard("grid", [row], [col], "isAlive", newState));
      // board.build();
      board.draw();

      console.timeEnd("shuffle");

      // return shuffleGrid;
    },

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
     * Generates the next generation
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
      board.nextGen();
      board.draw();
      setBoard("generation", board.generation + 1);
    },
  });

  onMount(() => {
    setBoard("grid", board.build());
  });

  return board as Store<GridStoreState>;
}
