import { Accessor, batch } from "solid-js";
import { CELL_WIDTH } from "../data";
import { confirmTendency } from "../helpers";

type Hash8Type = Uint8Array & { [index: number]: 0 | 1 };
type Hash8 = Prettify<Hash8Type>;

export default function useHash(
  screen: ScreenStoreState,
  data: Prettify<DataStore>,
  findColor: (i: number) => string,
  ctx: Accessor<CanvasRenderingContext2D | undefined>
) {
  const initHash = () => new Uint8Array(screen.nCell()).map(() => (data.randomChoice() ? 1 : 0)) as Hash8;

  let hash = initHash();
  let flipIndexes: number[] = [];

  const resetHash = () => {
    hash = initHash();
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

  const readHashAndDraw = () => {
    let i = 0;
    const rowSize = screen.nRow();
    const context = ctx();
    if (!context) return;
    while (i < flipIndexes.length) {
      const y = Math.floor(flipIndexes[i] / rowSize) * CELL_WIDTH;
      const x = (flipIndexes[i] % rowSize) * CELL_WIDTH; // 1,2,3,4, 5
      if (hash[flipIndexes[i]]) {
        context.fillStyle = findColor(i);
        context.fillRect(x, y, CELL_WIDTH, CELL_WIDTH);
      } else {
        context.clearRect(x, y, CELL_WIDTH, CELL_WIDTH);
      }

      i++;
    }
  };

  return { updateHash, readHashAndDraw, resetHash };
}
