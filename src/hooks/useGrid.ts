import type { Accessor } from "solid-js";
import { createMemo, onCleanup, onMount } from "solid-js";
import { createStore } from "solid-js/store";
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

const nRowInit = Math.floor(window.innerHeight / INITIAL_CELL_SIZE) + 1;
const nColInit = Math.floor(window.innerWidth / INITIAL_CELL_SIZE) + 1;
const nCellInit = nRowInit * nColInit;

export default function useGrid(ctx: Accessor<CanvasRenderingContext2D | undefined>) {
  const [board, setBoard] = createStore({
    wW: window.innerWidth,
    wH: window.innerHeight,
    nRow: nRowInit,
    nCol: nColInit,
    nCell: nCellInit,
    cellSize: INITIAL_CELL_SIZE,
  });

  const [gridSpacing, setGridSpacing] = createStore({
    visibility: true,
    spacing: DEFAULT_SPACING,
    gridColor: DEFAULT_GRID_COLOR,
    lastGridColor: DEFAULT_GRID_COLOR,
  });

  const [shape, setShape] = createStore({
    DEFAULT_SHAPES: ["square", "circle"],
    selectedShape: "square" as "square" | "circle",
  });

  const chooseGridColor = (color: string) => {
    setGridSpacing("gridColor", color);
    setGridSpacing("lastGridColor", color);
  };

  const changeSpacing = (addSpacing: number) => {
    const newSpacing = gridSpacing.spacing + addSpacing;
    if (newSpacing < MIN_SPACING || newSpacing > MAX_SPACING) return;
    if (newSpacing === 0) {
      setGridSpacing("gridColor", "transparent");
      if (gridSpacing.visibility) setGridSpacing("visibility", false);
    }
    setGridSpacing("spacing", newSpacing);
  };

  const toggleVisibility = () => {
    const newVisibility = !gridSpacing.visibility;
    setGridSpacing("visibility", newVisibility);
    newVisibility ? setGridSpacing("gridColor", gridSpacing.lastGridColor) : setGridSpacing("gridColor", "transparent");
  };

  const changeCellSize = (addSize: number) => {
    const newSize = board.cellSize + addSize;
    if (newSize < MIN_CELL_SIZE || newSize > MAX_CELL_SIZE) return;
    setBoard("cellSize", newSize);
  };
  const tuneCellSize = (newSize: number) => setBoard("cellSize", newSize);

  const setSquare = () => setShape("selectedShape", "square");
  const setCircle = () => setShape("selectedShape", "circle");

  const computeRow = createMemo(() => setBoard("nRow", Math.floor(board.wH / board.cellSize) + 1));
  const computeCol = createMemo(() => setBoard("nCol", Math.floor(board.wW / board.cellSize) + 1));
  const computeCell = createMemo(() => setBoard("nCell", board.nRow * board.nCol));

  const drawGrid = () => {
    const context = ctx();
    if (!context) return;
    context.clearRect(0, 0, board.wW, board.wH);
    if (!gridSpacing.visibility || gridSpacing.spacing === 0) return;

    context.beginPath();
    context.lineWidth = gridSpacing.spacing;
    context.strokeStyle = gridSpacing.gridColor;
    for (let i = 0; i < board.wW; i += board.cellSize) {
      context.moveTo(i, 0);
      context.lineTo(i, board.wH);
    }
    for (let i = 0; i < board.wH; i += board.cellSize) {
      context.moveTo(0, i);
      context.lineTo(board.wW, i);
    }
    context.stroke();
  };

  const updateSizes = () => {
    console.log("debounced");
    setBoard("wW", window.innerWidth);
    setBoard("wH", window.innerHeight);
    computeRow();
    computeCol();
    computeCell();
    drawGrid();
  };

  onMount(() => {
    const debouncedUpdateSizes = debounce(updateSizes, DEBOUNCING_DELAY);
    window.addEventListener("resize", debouncedUpdateSizes);
    onCleanup(() => window.removeEventListener("resize", debouncedUpdateSizes));
  });

  return {
    board,
    gridSpacing,
    shape,
    drawGrid,
    setSquare,
    setCircle,
    chooseGridColor,
    toggleVisibility,
    changeSpacing,
    tuneCellSize,
    changeCellSize,
  };
}
