import { batch, createEffect, createMemo } from "solid-js";
import type { Accessor } from "solid-js";
import type { GridHook } from "./useGrid";
import { getCoordsFromIndex, getIndexFromCoords } from "../helpers";

type Hash8Type = Uint8Array & { [index: number]: 0 | 1 };
type Hash8 = Prettify<Hash8Type>;

export default function useHash(
  grid: GridHook,
  data: Prettify<DataStore>,
  findColor: (i: number) => string,
  ctx: Accessor<CanvasRenderingContext2D | undefined>
) {
  const initHash = () => new Uint8Array(grid.nCell()).map(() => (data.randomChoice() ? 1 : 0)) as Hash8;

  let hash = initHash();
  let flipIndexes: number[] = [];

  /** hash is totally regenerated and draw (SLOW) */
  const resetHash = () => {
    hash = initHash();
    drawHashOnReset();
  };

  /** hash change size if needed (copy) */
  const resizeHash = () => {
    const pastSize = hash.length;
    const newSize = grid.nCell();
    if (newSize === pastSize) return;
    else if (newSize < pastSize) {
      hash = hash.copyWithin(0, newSize);
    } else {
      const diff = newSize - pastSize;
      const newDiffHash = new Uint8Array(diff).map(() => (data.randomChoice() ? 1 : 0)) as Hash8;
      const newHash = new Uint8Array(diff + pastSize) as Hash8;

      newHash.set(hash, 0);
      newHash.set(newDiffHash, pastSize);
      hash = newHash;
    }
  };

  /** updateHash counting alives neighbors and judgment if alive or dead ( mutation in-place ) */
  const updateHash = () => {
    let i = 0;
    flipIndexes = [];
    const rowSize = grid.nRow();
    let zeros = 0;
    let ones = 0;
    while (i < hash.length) {
      const center = hash[i] ?? 0;

      /** Count alive neighbors */
      const neighbors =
        (hash[i - rowSize - 1] ?? 0) + // topLeft
        (hash[i - rowSize] ?? 0) + // top
        (hash[i - rowSize + 1] ?? 0) + // topRight
        (hash[i + 1] ?? 0) + // right
        (hash[i - 1] ?? 0) + // left
        (hash[i + rowSize - 1] ?? 0) + // bottomLeft
        (hash[i + rowSize] ?? 0) + // bottom
        (hash[i + rowSize + 1] ?? 0); // bottomRight

      /** Apply rules */
      if ((center && (neighbors < 2 || neighbors > 3)) || (!center && neighbors === 3)) flipIndexes.push(i);
      i++;

      /** Statistiques */
      center ? ones++ : zeros++;
    }

    batch(() => {
      data.setAlive(ones);
      data.setDead(zeros);
    });

    flipHashAtIndexes(flipIndexes);
  };

  const flipHashAtIndexes = (intArr: number[]) => {
    let i = 0;
    while (i < intArr.length) {
      hash[intArr[i]] ^= 1;
      i++;
    }
    return intArr;
  };

  /** draw only changed cells, doesn't read the entire hash (FAST) */
  const drawHash = () => {
    let i = 0;
    const rowSize = grid.nRow();
    const context = ctx();
    if (!context) return;
    while (i < flipIndexes.length) {
      const [x, y] = getCoordsFromIndex(flipIndexes[i], rowSize, grid.cellSize());

      if (hash[flipIndexes[i]]) {
        context.fillStyle = findColor(i);
        context.fillRect(x, y, grid.cellSize(), grid.cellSize());
      } else {
        context.clearRect(x, y, grid.cellSize(), grid.cellSize());
      }

      i++;
    }
  };

  /** draw and read the entire hash (SLOW) */
  const drawHashOnReset = () => {
    let i = 0;
    const rowSize = grid.nRow();
    const context = ctx();
    if (!context) return;
    while (i < hash.length) {
      const x = Math.floor(i / rowSize) * grid.cellSize();
      const y = (i % rowSize) * grid.cellSize();
      if (hash[i]) {
        context.fillStyle = findColor(i);
        context.fillRect(x, y, grid.cellSize(), grid.cellSize());
      } else {
        context.clearRect(x, y, grid.cellSize(), grid.cellSize());
      }

      i++;
    }
  };

  const paintCell = (x: number, y: number) => {
    // get index from coords
    const index = getIndexFromCoords(x, y, grid.nRow(), grid.cellSize());
    const gridCoord = getCoordsFromIndex(index, grid.nRow(), grid.cellSize());
    if (hash[index]) return; // if already alive, return early because we don't want to draw it again
    hash[index] = 1; // set cell alive
    // draw cell
    const context = ctx();
    if (!context) return;
    context.fillStyle = findColor(index);
    context.fillRect(gridCoord[0], gridCoord[1], grid.cellSize(), grid.cellSize());
  };

  createEffect(() => {
    if (grid.nCell() !== hash.length) {
      resizeHash();
      drawHashOnReset();
    }
  });

  return { updateHash, drawHash, resetHash, paintCell };
}
