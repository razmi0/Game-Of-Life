import type { Accessor } from "solid-js";
import { batch, createMemo, createSignal, onCleanup, onMount } from "solid-js";
import { INITIAL_CELL_SIZE, MAX_CELL_SIZE, MIN_CELL_SIZE } from "../data";
import { debounce } from "../helpers";
import { createStore } from "solid-js/store";

const nRowInit = Math.floor(window.innerHeight / INITIAL_CELL_SIZE) + 1;
const nColInit = Math.floor(window.innerWidth / INITIAL_CELL_SIZE) + 1;
const nCellInit = nRowInit * nColInit;

export type GridHook = {
  nRow: Accessor<number>;
  nCol: Accessor<number>;
  nCell: Accessor<number>;
  wW: Accessor<number>;
  wH: Accessor<number>;
  cellSize: Accessor<number>;
  shape: Prettify<{
    DEFAULT_SHAPES: ["square", "circle"];
    selectedShape: "square" | "circle";
    /** ACTIONS */
    setSquare: () => void;
    setCircle: () => void;
  }>;
  gridSpacing: {
    seeGrid: boolean;
    spacing: number;
    /** ACTIONS */
    toggleGrid: () => void;
    tuneSpacing: (newSpacing: number) => void;
    changeSpacing: (addSpacing: number) => void;
  };
  /** ACTIONS */
  changeCellSize: (newSize: number) => void;
  tuneCellSize: (newSize: number) => void;
  toggleGrid: () => void;
};
export default function useGrid() {
  const [wW, setWW] = createSignal(window.innerWidth);
  const [wH, setWH] = createSignal(window.innerHeight);
  const [nRow, setnRow] = createSignal(nRowInit);
  const [nCol, setnCol] = createSignal(nColInit);
  const [nCell, setnCell] = createSignal(nCellInit);
  const [cellSize, setCellSize] = createSignal(INITIAL_CELL_SIZE);
  const [gridSpacing, setGridSpacing] = createStore({
    seeGrid: false,
    spacing: 1,
    tuneSpacing: (newSpacing: number) => {
      setGridSpacing("spacing", newSpacing);
    },
    changeSpacing: (addSpacing: number) => {
      const newSpacing = gridSpacing.spacing + addSpacing;
      if (newSpacing < 1 || newSpacing > 10) return;
      setGridSpacing("spacing", newSpacing);
    },
    toggleGrid: () => {
      setGridSpacing("seeGrid", !gridSpacing.seeGrid);
    },
  });
  const [shape, setShape] = createStore({
    DEFAULT_SHAPES: ["square", "circle"],
    selectedShape: "square",
    setSquare: () => {
      setShape("selectedShape", "square");
    },
    setCircle: () => {
      setShape("selectedShape", "circle");
    },
  });

  const calcnRow = createMemo(() => {
    setnRow(Math.floor(wH() / cellSize()) + 1);
  });

  const calcnCol = createMemo(() => {
    setnCol(Math.floor(wW() / cellSize()) + 1);
  });

  const calcnCell = createMemo(() => {
    setnCell(nRow() * nCol());
  });

  const changeCellSize = (addSize: number) => {
    const newSize = cellSize() + addSize;
    if (newSize < MIN_CELL_SIZE || newSize > MAX_CELL_SIZE) return;
    setCellSize(newSize);
  };

  const tuneCellSize = (newSize: number) => {
    setCellSize(newSize);
  };

  const delayDebounce = 80;
  const updateSizes = debounce(() => {
    batch(() => {
      setWW(window.innerWidth);
      setWH(window.innerHeight);
    });
    batch(() => {
      calcnRow();
      calcnCol();
      calcnCell();
    });
  }, delayDebounce);

  onMount(() => {
    window.addEventListener("resize", updateSizes);
    onCleanup(() => window.removeEventListener("resize", updateSizes));
  });

  return {
    nRow,
    nCol,
    nCell,
    wW,
    wH,
    cellSize,
    /** ACTIONS */
    shape,
    gridSpacing,
    changeCellSize,
    tuneCellSize,
  } as Prettify<GridHook>;
}
