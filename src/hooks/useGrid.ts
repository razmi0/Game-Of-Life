import type { Accessor } from "solid-js";
import { batch, createMemo, createSignal, onCleanup, onMount } from "solid-js";
import {
  DEBOUNCING_DELAY,
  DEFAULT_SPACING,
  INITIAL_CELL_SIZE,
  MAX_CELL_SIZE,
  MAX_SPACING,
  MIN_CELL_SIZE,
  MIN_SPACING,
} from "../data";
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
  /** ACTIONS */
  changeCellSize: (newSize: number) => void;
  tuneCellSize: (newSize: number) => void;
  toggleGrid: () => void;
  drawGrid: () => void;
  /** STORE */
  shape: Prettify<{
    DEFAULT_SHAPES: ["square", "circle"];
    selectedShape: "square" | "circle";
    /** ACTIONS */
    setSquare: () => void;
    setCircle: () => void;
  }>;
  gridSpacing: {
    visibility: boolean;
    spacing: number;
    gridColor: string;
    toggleVisibility: () => void;
    tuneSpacing: (newSpacing: number) => void;
    changeSpacing: (addSpacing: number) => void;
  };
};
export default function useGrid(ctx: Accessor<CanvasRenderingContext2D | undefined>) {
  const [wW, setWW] = createSignal(window.innerWidth);
  const [wH, setWH] = createSignal(window.innerHeight);
  const [nRow, setnRow] = createSignal(nRowInit);
  const [nCol, setnCol] = createSignal(nColInit);
  const [nCell, setnCell] = createSignal(nCellInit);
  const [cellSize, setCellSize] = createSignal(INITIAL_CELL_SIZE);

  /** gridSpacing */
  const [gridSpacing, setGridSpacing] = createStore({
    visibility: true,
    spacing: DEFAULT_SPACING,
    gridColor: "#FFFFFF",
    tuneSpacing: (newSpacing: number) => {
      setGridSpacing("spacing", newSpacing);
    },
    changeSpacing: (addSpacing: number) => {
      const newSpacing = gridSpacing.spacing + addSpacing;
      if (newSpacing < MIN_SPACING || newSpacing > MAX_SPACING) return;
      setGridSpacing("spacing", newSpacing);
    },
    toggleVisibility: () => {
      setGridSpacing("visibility", !gridSpacing.visibility);
    },
  });

  const drawGrid = () => {
    const context = ctx();
    if (!context) return;
    context.beginPath();
    context.lineWidth = gridSpacing.spacing;
    context.strokeStyle = gridSpacing.gridColor;
    for (let i = 0; i < wW(); i += cellSize()) {
      context.moveTo(i, 0);
      context.lineTo(i, wH());
    }
    for (let i = 0; i < wH(); i += cellSize()) {
      context.moveTo(0, i);
      context.lineTo(wW(), i);
    }
    context.stroke();
  };

  /** shape */
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
    // wee add the gridSpacing to the cellSize to avoid a bug where the grid is not drawn
    setnRow(Math.floor(wH() / cellSize() + gridSpacing.spacing) + 1);
    // setnRow(Math.floor(wH() / cellSize()) + 1);
  });

  const calcnCol = createMemo(() => {
    setnCol(Math.floor(wW() / cellSize() + gridSpacing.spacing) + 1);
    // setnCol(Math.floor(wW() / cellSize()) + 1);
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
  }, DEBOUNCING_DELAY);

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
    /** ACTIONS & STORE */
    shape,
    gridSpacing,
    changeCellSize,
    tuneCellSize,
    drawGrid,
  } as Prettify<GridHook>;
}
