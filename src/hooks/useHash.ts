import { Accessor } from "solid-js";
import { CELL_WIDTH } from "../data";

type Hash8Type = Uint8Array & { [index: number]: 0 | 1 };
type Hash8 = Prettify<Hash8Type>;

export default function useHash(
  screen: ScreenStoreState,
  board: GridStoreState,
  findColor: (i: number) => string,
  ctx: Accessor<CanvasRenderingContext2D | undefined>
) {
  const initHash = () => new Uint8Array(screen.nCell()).map(() => (randomWithInput() ? 1 : 0)) as Hash8;

  const hash = initHash();

  const randomWithInput = () => (Math.random() * 100 - board.randomness + 50 > 50 ? true : false);

  /** updateHash counting alives neighbors and judgment ( in-place ) */
  const updateHash = () => {
    let i = 0;
    const trackingArr = [];
    const rowSize = screen.nRow();
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
      if ((center && (neighbors < 2 || neighbors > 3)) || (!center && neighbors === 3)) trackingArr.push(i);
      i++;
    }

    let j = 0;
    while (j < trackingArr.length) {
      hash[trackingArr[j]] ^= 1;
      j++;
    }
  };

  const readHashAndDraw = () => {
    console.time("readHash");
    let i = 0;
    const rowSize = screen.nRow();
    const context = ctx();
    if (!context) return;
    context.reset();
    while (i < hash.length) {
      const y = Math.floor(i / rowSize) * CELL_WIDTH;
      const x = (i % rowSize) * CELL_WIDTH;

      context.fillStyle = hash[i] ? findColor(i) : "black";
      context.fillRect(x, y, CELL_WIDTH, CELL_WIDTH);

      i++;
    }
    console.timeEnd("readHash");
  };

  const run = () => {
    updateHash();
    readHashAndDraw();
  };

  return { run };
}
