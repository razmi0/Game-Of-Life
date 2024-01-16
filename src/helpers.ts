import { Accessor, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { createStore } from "solid-js/store";

const ALIVE_RATIO = 0.05 as const;
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

export const useGameOfLife = (
  cellWidth: number
): [Accessor<number>, Accessor<number>, (ctx: CanvasRenderingContext2D) => void, () => void] => {
  const [width, setWidth] = createSignal(window.innerWidth);
  const [height, setHeight] = createSignal(window.innerHeight);
  const [grid, setGrid] = createStore<GridType>({
    grid: [],
  });

  createEffect(() => {
    window.addEventListener("resize", () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    });
  });

  onCleanup(() => {
    window.removeEventListener("resize", () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    });
  });

  const nbrRows = Math.floor(width() / cellWidth);
  const nbrCols = Math.floor(height() / cellWidth);
  const nbrOfCells = Math.floor(width() / cellWidth) * Math.floor(height() / cellWidth);

  /**
   * Mounting the grid & use buildCell and randomize the cells
   * init fn
   */
  onMount(() => {
    console.log("building grid");
    setGrid(
      "grid",
      new Array(nbrRows).fill(null).map((_, i) => {
        return new Array(nbrCols).fill(null).map((_, j) => {
          return buildCell(i * cellWidth, j * cellWidth, cellWidth);
        });
      })
    );
  });

  /**
   * Loop through the grid and draw the cells to ctx
   * leaf fn
   * @param ctx
   */
  const drawGrid = (ctx: CanvasRenderingContext2D) => {
    grid.grid.map((row) => {
      row.map((cell) => {
        ctx.fillStyle = cell.isAlive ? "transparent" : "black";
        ctx.fillRect(cell.x, cell.y, cell.width, cell.width);
      });
    });
  };

  /**
   * Count the neighbors of a cell ( 8 )
   * leaf fn
   * @returns
   */
  const countNeighbors = (i: number, j: number) => {
    let neighbors = 0;
    const rowLength = grid.grid[0].length;
    for (let k = -1; k <= 1; k++) {
      for (let l = -1; l <= 1; l++) {
        if (i + k < 0 || i + k >= grid.grid.length || j + l < 0 || j + l >= rowLength) continue;
        if (grid.grid[i + k][j + l].isAlive) neighbors++;
      }
    }
    return neighbors;
  };

  /**
   * Next generation
   * mutate fn
   */
  const nextGen = () => {
    let alives = 0;
    for (let i = 0; i < grid.grid.length; i++) {
      for (let j = 0; j < grid.grid[0].length; j++) {
        const neighbors = countNeighbors(i, j);
        const isAlive = judgement(grid.grid[i][j], neighbors);
        setGrid("grid", [i], [j], "isAlive", isAlive);
        if (isAlive) alives++;
      }
    }
    console.log("Alives", alives);
  };

  /**
   * Evolve the cell into alive or dead
   * return  fn
   */
  const judgement = (cell: Cell, count: number) => {
    let alive = cell.isAlive;
    if (count < 2 && cell.isAlive) alive = false;
    if (count > 3 && cell.isAlive) alive = false;
    if (count === 3 && !cell.isAlive) alive = true;
    return alive;
  };

  return [width, height, drawGrid, nextGen];
};
