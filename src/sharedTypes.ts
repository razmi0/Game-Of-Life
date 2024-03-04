import { Tools } from "./hooks/usePainter";

export type PaintCellType = {
  x: number;
  y: number;
  paintSize: number;
  tool: Tools;
  penColor: string;
};
