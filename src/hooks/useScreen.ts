import type { Accessor } from "solid-js";
import { batch, createMemo, createSignal, onCleanup, onMount } from "solid-js";
import { CELL_WIDTH } from "../data";
import { debounce } from "../helpers";

const nRowInit = Math.floor(window.innerHeight / CELL_WIDTH) + 1;
const nColInit = Math.floor(window.innerWidth / CELL_WIDTH) + 1;
const nCellInit = nRowInit * nColInit;

export type ScreenHook = {
  nRow: Accessor<number>;
  nCol: Accessor<number>;
  nCell: Accessor<number>;
  wW: Accessor<number>;
  wH: Accessor<number>;
};
export default function useScreen() {
  const [wW, setWW] = createSignal(window.innerWidth);
  const [wH, setWH] = createSignal(window.innerHeight);
  const [nRow, setnRow] = createSignal(nRowInit);
  const [nCol, setnCol] = createSignal(nColInit);
  const [nCell, setnCell] = createSignal(nCellInit);

  const calcnRow = createMemo(() => {
    setnRow(Math.floor(wH() / CELL_WIDTH) + 1);
  });

  const calcnCol = createMemo(() => {
    setnCol(Math.floor(wW() / CELL_WIDTH) + 1);
  });

  const calcnCell = createMemo(() => {
    setnCell(nRow() * nCol());
  });

  const updateSizes = debounce(() => {
    console.log("Resizing screen & cells in useScreen");
    batch(() => {
      setWW(window.innerWidth);
      setWH(window.innerHeight);
    });
    batch(() => {
      calcnRow();
      calcnCol();
      calcnCell();
    });
  }, 100);

  onMount(() => {
    window.addEventListener("resize", updateSizes);
    onCleanup(() => window.removeEventListener("resize", updateSizes));
  });

  return { nRow, nCol, nCell, wW, wH } as Prettify<ScreenHook>;
}
