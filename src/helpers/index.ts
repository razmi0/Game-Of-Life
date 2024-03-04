export const debounce = (fn: Function, delay: number) => {
  let timeoutId: number;
  return function (...args: any) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

// export const getCoordsFromIndex = (index: number, rowSize: number, cellSize: number) => {
//   const x = Math.floor(index / rowSize) * cellSize;
//   const y = (index % rowSize) * cellSize;
//   return [x, y];
// };

// export const getIndexFromCoords = (x: number, y: number, rowSize: number, cellSize: number) => {
//   return Math.floor(x / cellSize) * rowSize + Math.floor(y / cellSize);
// };

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
