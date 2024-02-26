export const debounce = (fn: Function, delay: number) => {
  let timeoutId: number;
  return function (...args: any) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

export const getCoordsFromIndex = (index: number, rowSize: number, cellSize: number) => {
  const x = Math.floor(index / rowSize) * cellSize;
  const y = (index % rowSize) * cellSize;
  return [x, y];
};

export const getIndexFromCoords = (x: number, y: number, rowSize: number, cellSize: number) => {
  return Math.floor(x / cellSize) * rowSize + Math.floor(y / cellSize);
};
