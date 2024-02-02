import { createStore } from "solid-js/store";

export function useHash(screen: ScreenStoreState, board: GridStoreState) {
  const hash = {
    hash: new Uint8Array(screen.nCell()).map(() => (board.randomChoice() ? 1 : 0)),
    updateHash: () => {
      console.time("updateHash");
      let i = 0;
      const rowSize = screen.nRow();
      while (i < hash.hash.length) {
        const center = hash.hash[i] ?? 0;

        /** Count alive neighbors */

        const top = hash.hash[i - rowSize] ?? 0;
        const topRight = hash.hash[i - rowSize + 1] ?? 0;
        const right = hash.hash[i + 1] ?? 0;
        const bottomRight = hash.hash[i + rowSize + 1] ?? 0;
        const bottom = hash.hash[i + rowSize] ?? 0;
        const bottomLeft = hash.hash[i + rowSize - 1] ?? 0;
        const left = hash.hash[i - 1] ?? 0;
        const topLeft = hash.hash[i - rowSize - 1] ?? 0;

        const neighbors = top + topRight + right + bottomRight + bottom + bottomLeft + left + topLeft;

        /** Apply rules */

        if (center === 1) {
          // underpopulation
          if (neighbors < 2) hash.hash[i] = 0;
          // overpopulation
          if (neighbors > 3) hash.hash[i] = 0;
        } else {
          // reproduction
          if (neighbors === 3) hash.hash[i] = 1;
        }

        i++;
      }
      console.timeEnd("updateHash");
    },
  };
  return hash;
}

export function useLife() {
  const buildCell = (x: number, y: number, isAlive: boolean, color: string) => {
    return {
      x,
      y,
      color,
    };
  };
}
