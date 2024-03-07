import { batch, createEffect, createSignal, onMount } from "solid-js";
import { getCoordsFromIndex, getIndexFromCoords } from "../helpers";
import type { Accessor } from "solid-js";
import type { GridHook } from "./useGrid";
import type { ColorHook } from "./useColors";
import { PaintCellType } from "../sharedTypes";

type Hash8Type = Uint8Array & { [index: number]: 0 | 1 };
type Hash8 = Prettify<Hash8Type>;

export default function useHash(
  grid: GridHook,
  data: DataStore,
  color: ColorHook,
  ctx: Accessor<CanvasRenderingContext2D | undefined>
) {
  const [isWorkingOnHash, setIsWorkingOnHash] = createSignal(false);

  const initHash = () => new Uint8Array(grid.nCell()).map(() => (data.randomChoice() ? 1 : 0)) as Hash8;

  let hash = initHash();
  let flipIndexes: number[] = [];

  /** hash is totally regenerated and draw (SLOW) */
  const resetHash = () => {
    hash = initHash();
    drawAllHash();
  };

  /** hash change size if needed (copy) */
  const resizeHash = () => {
    const pastSize = hash.length;
    const newSize = grid.nCell();
    if (newSize === pastSize) return;
    else if (newSize < pastSize) {
      hash = hash.copyWithin(0, newSize);
    } else {
      const diff = newSize - pastSize;
      const newDiffHash = new Uint8Array(diff).map(() => (data.randomChoice() ? 1 : 0)) as Hash8;
      const newHash = new Uint8Array(diff + pastSize) as Hash8;

      newHash.set(hash, 0);
      newHash.set(newDiffHash, pastSize);
      hash = newHash;
    }
  };

  /** updateHash counting alives neighbors and judgment if alive or dead ( mutation in-place ) */
  const updateHash = () => {
    let i = 0;
    flipIndexes = [];
    const rowSize = grid.nRow();
    let zeros = 0;
    let ones = 0;
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
      if ((center && (neighbors < 2 || neighbors > 3)) || (!center && neighbors === 3)) flipIndexes.push(i);
      i++;

      /** Statistiques */
      center ? ones++ : zeros++;
    }

    batch(() => {
      data.setAlive(ones);
      data.setDead(zeros);
    });

    flipHashAtIndexes(flipIndexes);
  };

  const flipHashAtIndexes = (indexesArr: number[]) => {
    let i = 0;
    while (i < indexesArr.length) {
      hash[indexesArr[i]] ^= 1;
      i++;
    }
  };

  /**
   * @description draw a shape at a given position
   */
  const drawShapeWithColor = (data: DrawShapeWithColorType) => {
    const { context, x, y, cellSize, fillStyle } = data;
    const spacingAllowed = grid.gridSpacing.visibility;
    const shape = grid.shape.selectedShape;
    const spacing = grid.gridSpacing.spacing * 2;

    const finalSize = spacingAllowed ? cellSize - spacing : cellSize;

    switch (shape) {
      case "square": {
        if (fillStyle.cell) {
          context.fillStyle = fillStyle.cell;
          context.fillRect(x, y, finalSize, finalSize);
        }
        if (spacingAllowed) {
          // we draw borders on the rect if spacing is allowed
          context.strokeStyle = fillStyle.spacing ?? "white";
          context.lineWidth = spacing;

          context.strokeRect(x, y, finalSize, finalSize);

          // context.fillStyle = fillStyle.spacing ?? "white";
          // context.fillRect(x, y, finalSize, spacing);
        }
        break;
      }

      case "circle": {
        context.beginPath();
        context.arc(x + cellSize / 2, y + cellSize / 2, cellSize / 2, 0, Math.PI * 2);
        context.fill();
        break;
      }
    }
  };

  /** draw only changed cells, doesn't read the entire hash (FAST) */
  const drawHash = () => {
    let i = 0;
    const rowSize = grid.nRow();
    const cellSize = grid.sizes.cell;
    const context = ctx();
    if (!context) return;
    while (i < flipIndexes.length) {
      const [x, y] = getCoordsFromIndex({ index: flipIndexes[i], rowSize: rowSize, cellSize: cellSize }); // flipIndexes[i], rowSize, grid.cellSize()

      // Check if hash at current index is truthy
      if (hash[flipIndexes[i]]) {
        // Draw shape with appropriate color
        const fillStyle = { cell: color.findColor(i), spacing: grid.gridSpacing.gridColor };
        drawShapeWithColor({ context, x, y, cellSize, fillStyle });
      }
      // Check if corpse has to be drawn
      else if (!color.seeCorpse()) {
        // Clear the cell if corpse is not visible
        context.clearRect(x, y, cellSize, cellSize);
        const fillStyle = { cell: "transparent", spacing: grid.gridSpacing.gridColor };
        drawShapeWithColor({ context, x, y, cellSize, fillStyle });
      }
      // Default case
      else {
        // Clear cell and draw dead color shape
        // context.clearRect(x, y, cellSize, cellSize);
        const fillStyle = { cell: color.greyScaledHex(flipIndexes[i]), spacing: grid.gridSpacing.gridColor };
        drawShapeWithColor({ context, x, y, cellSize, fillStyle });
      }

      i++;
    }
  };

  const resetBlankHash = () => {
    hash = new Uint8Array(grid.nCell()) as Hash8;
  };

  /** draw and read the entire hash (SLOW) */
  const drawAllHash = () => {
    let index = 0;
    const rowSize = grid.nRow();
    const cellSize = grid.sizes.cell;
    const context = ctx();
    if (!context) return;
    while (index < hash.length) {
      const [x, y] = getCoordsFromIndex({ index, rowSize, cellSize });
      if (hash[index]) {
        const fillStyle = { cell: color.findColor(index), spacing: grid.gridSpacing.gridColor };
        drawShapeWithColor({ context, x, y, cellSize, fillStyle });
      } else {
        context.clearRect(x, y, cellSize, cellSize);
        const fillStyle = { cell: "transparent", spacing: grid.gridSpacing.gridColor };
        drawShapeWithColor({ context, x, y, cellSize, fillStyle });
      }

      index++;
    }
  };

  const paintCell = (data: PaintCellType) => {
    const { x, y, paintSize, tool, penColor } = data;
    const context = ctx();
    if (!context) return;

    const rowSize = grid.nRow();
    const cellSize = grid.sizes.cell;

    const offsetXPainted = paintSize - 1;
    const offsetYPainted = offsetXPainted * rowSize;

    const index = getIndexFromCoords({ x, y, rowSize, cellSize }); // center index x, y, rowSize, cellSize

    for (let row = -offsetYPainted; row <= offsetYPainted; row += rowSize) {
      for (let col = -offsetXPainted; col <= offsetXPainted; col++) {
        const paintedIndex = index + row + col;
        if (paintedIndex < 0 || paintedIndex > hash.length) return;

        switch (tool) {
          case "pen": {
            if (hash[paintedIndex]) continue;
            hash[paintedIndex] = 1;
            const [x, y] = getCoordsFromIndex({ index: paintedIndex, rowSize, cellSize });

            if (penColor) {
              const fillStyle = { cell: penColor, spacing: grid.gridSpacing.gridColor };
              color.changeColorAtIndex(penColor, paintedIndex);
              drawShapeWithColor({ context, x, y, cellSize, fillStyle });
            } else {
              const fillStyle = { cell: color.findColor(paintedIndex), spacing: grid.gridSpacing.gridColor };
              drawShapeWithColor({ context, x, y, cellSize, fillStyle });
            }

            break;
          }

          case "eraser":
            if (!hash[paintedIndex]) continue;
            hash[paintedIndex] = 0;
            const [x, y] = getCoordsFromIndex({ index: paintedIndex, rowSize, cellSize });

            context.clearRect(x, y, cellSize, cellSize);

            break;
        }
      }
    }
  };

  createEffect(() => {
    if (grid.nCell() !== hash.length) {
      resizeHash();
      drawAllHash();
    }
  });

  return {
    updateHash,
    drawHash,
    resetHash,
    paintCell,
    drawAllHash,
    resetBlankHash,
    isWorkingOnHash,
    setIsWorkingOnHash,
  };
}
