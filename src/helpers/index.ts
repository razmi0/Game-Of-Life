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

type FpsOptionsType = {
  showUnit?: boolean;
  digits?: number;
};

export const fps = (speed: number, options: FpsOptionsType = {}) => {
  const strShowUnit = options.showUnit ? " fps" : "";
  const digits = options.digits || 0;
  if (speed === 0) return "max" + strShowUnit;
  const lbl = 1000 / speed;
  if (lbl < 1) return "< 1" + strShowUnit;
  if (lbl > 200) return "> 200" + strShowUnit;
  if (digits === 0) return Math.floor(lbl) + strShowUnit;
  return lbl.toFixed(digits) + strShowUnit;
};
