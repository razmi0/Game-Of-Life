import type { Accessor } from "solid-js";
import { batch, createMemo, createSignal, onCleanup, onMount } from "solid-js";
import {
  DEBOUNCING_DELAY,
  DEFAULT_GRID_COLOR,
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

export default function useGrid(ctx: Accessor<CanvasRenderingContext2D | undefined>) {
  const [wW, setWW] = createSignal(window.innerWidth);
  const [wH, setWH] = createSignal(window.innerHeight);
  const [nRow, setnRow] = createSignal(nRowInit);
  const [nCol, setnCol] = createSignal(nColInit);
  const [nCell, setnCell] = createSignal(nCellInit);
  const [cellSize, setCellSize] = createSignal(INITIAL_CELL_SIZE);

  const [gridSpacing, setGridSpacing] = createStore({
    visibility: true,
    spacing: DEFAULT_SPACING,
    gridColor: DEFAULT_GRID_COLOR,
    lastGridColor: DEFAULT_GRID_COLOR,
  });

  const chooseGridColor = (color: string) => {
    setGridSpacing("gridColor", color);
    setGridSpacing("lastGridColor", color);
    drawGrid();
  };

  const changeSpacing = (addSpacing: number) => {
    const newSpacing = gridSpacing.spacing + addSpacing;
    if (newSpacing < MIN_SPACING || newSpacing > MAX_SPACING) return;
    setGridSpacing("spacing", newSpacing);
    drawGrid();
  };

  const toggleVisibility = () => {
    const newVisibility = !gridSpacing.visibility;
    setGridSpacing("visibility", newVisibility);
    newVisibility ? setGridSpacing("gridColor", gridSpacing.lastGridColor) : setGridSpacing("gridColor", "transparent");
    drawGrid();
  };

  const changeCellSize = (addSize: number) => {
    const newSize = cellSize() + addSize;
    if (newSize < MIN_CELL_SIZE || newSize > MAX_CELL_SIZE) return;
    setCellSize(newSize);
  };

  const tuneCellSize = (newSize: number) => {
    setCellSize(newSize);
  };

  const [shape, setShape] = createStore({
    DEFAULT_SHAPES: ["square", "circle"],
    selectedShape: "square" as "square" | "circle",
  });

  const setSquare = () => {
    setShape("selectedShape", "square");
  };

  const setCircle = () => {
    setShape("selectedShape", "circle");
  };

  const calcnRow = createMemo(() => {
    setnRow(Math.floor(wH() / cellSize()) + 1);
  });

  const calcnCol = createMemo(() => {
    setnCol(Math.floor(wW() / cellSize()) + 1);
  });

  const calcnCell = createMemo(() => {
    setnCell(nRow() * nCol());
  });

  const drawGrid = () => {
    const context = ctx();
    if (!context) return;
    context.clearRect(0, 0, wW(), wH());
    if (!gridSpacing.visibility || gridSpacing.spacing === 0) return;

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

  const updateSizes = debounce(() => {
    setWW(window.innerWidth);
    setWH(window.innerHeight);
    calcnRow();
    calcnCol();
    calcnCell();
    drawGrid();
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
    drawGrid,
    shape,
    setSquare,
    setCircle,
    gridSpacing,
    chooseGridColor,
    toggleVisibility,
    changeSpacing,
    tuneCellSize,
    changeCellSize,
  };
}
