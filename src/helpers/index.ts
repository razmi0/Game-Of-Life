export const debounce = (fn: Function, delay: number) => {
  let timeoutId: number;
  return function (...args: any) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

type CoordsFromIndexData = {
  index: number;
  rowSize: number;
  cellSize: number;
};
export const getCoordsFromIndex = (data: CoordsFromIndexData) => {
  const { index, rowSize, cellSize } = data;
  const x = Math.floor(index / rowSize) * cellSize;
  const y = (index % rowSize) * cellSize;
  return [x, y];
};

type IndexFromCoordsData = {
  x: number;
  y: number;
  rowSize: number;
  cellSize: number;
};
export const getIndexFromCoords = (data: IndexFromCoordsData) => {
  const { x, y, rowSize, cellSize } = data;
  return Math.floor(x / cellSize) * rowSize + Math.floor(y / cellSize);
};

export const fps = (speed: number, showUnit: boolean = true) => {
  const strShowUnit = showUnit ? " fps" : "";
  if (speed === 0) return "max" + strShowUnit;
  const lbl = 1000 / speed;
  return lbl > 200 ? "> 200" + strShowUnit : Math.floor(lbl) + strShowUnit;
};
