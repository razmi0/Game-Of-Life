import { batch, createEffect } from "solid-js";
import { CELL_WIDTH } from "../data";
import type { Accessor } from "solid-js";
import type { ScreenHook } from "./useScreen";

type Hash8Type = Uint8Array & { [index: number]: 0 | 1 };
type Hash8 = Prettify<Hash8Type>;

export default function useHash(
  screen: ScreenHook,
  data: Prettify<DataStore>,
  findColor: (i: number) => string,
  ctx: Accessor<CanvasRenderingContext2D | undefined>
) {
  const initHash = () => {
    console.log("initHash", screen.nCell());
    return new Uint8Array(screen.nCell()).map(() => (data.randomChoice() ? 1 : 0)) as Hash8;
  };

  let hash = initHash();
  let flipIndexes: number[] = [];

  /** hash is totally regenerated and draw (SLOW) */
  const resetHash = () => {
    hash = initHash();
    drawHashOnReset();
  };

  /** hash change size if needed (copy) */

  const resizeHash = () => {
    const pastSize = hash.length; // old screen.nCell()
    const newSize = screen.nCell(); // new screen.nCell()
    if (newSize === pastSize) return;
    if (newSize < pastSize) {
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
    const rowSize = screen.nRow();
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

    let j = 0;
    while (j < flipIndexes.length) {
      hash[flipIndexes[j]] ^= 1;
      j++;
    }
  };

  /** draw only changed cells, doesn't read the entire hash (FAST) */
  const drawHash = () => {
    let i = 0;
    const rowSize = screen.nRow();
    const context = ctx();
    if (!context) return;
    while (i < flipIndexes.length) {
      const x = Math.floor(flipIndexes[i] / rowSize) * CELL_WIDTH;
      const y = (flipIndexes[i] % rowSize) * CELL_WIDTH;
      if (hash[flipIndexes[i]]) {
        context.fillStyle = findColor(i);
        context.fillRect(x, y, CELL_WIDTH, CELL_WIDTH);
      } else {
        context.clearRect(x, y, CELL_WIDTH, CELL_WIDTH);
      }

      i++;
    }
  };

  /** draw and read the entire hash (SLOW) */
  const drawHashOnReset = () => {
    let i = 0;
    const rowSize = screen.nRow();
    const context = ctx();
    if (!context) return;
    while (i < hash.length) {
      const x = Math.floor(i / rowSize) * CELL_WIDTH;
      const y = (i % rowSize) * CELL_WIDTH;
      if (hash[i]) {
        context.fillStyle = findColor(i);
        context.fillRect(x, y, CELL_WIDTH, CELL_WIDTH);
      } else {
        context.clearRect(x, y, CELL_WIDTH, CELL_WIDTH);
      }

      i++;
    }
  };

  createEffect(() => {
    if (screen.nCell()) {
      resizeHash();
      updateHash();
      drawHash();
    }
  });

  return { updateHash, drawHash, resetHash };
}
