import { createEffect, createSignal, onCleanup } from "solid-js";
import { DEFAULT_PALETTE, INITIAL_PEN_SIZE, MAX_PEN_SIZE, MIN_PEN_SIZE } from "../data";
import { PaintCellType } from "../sharedTypes";

type EnumPainterType = "idle" | "painting";
const EnumPainter = {
  IDLE: "idle",
  PAINTING: "painting",
} as const;

export type EnumToolsType = "pen" | "eraser" | "none";
const EnumTools = {
  PEN: "pen",
  ERASER: "eraser",
  NONE: "none",
} as const;

type RunningPainterCb = { work: FunctionWithParams<PaintCellType> };

const usePainter = (hash: RunningPainterCb) => {
  const [painterState, setPainter] = createSignal<EnumPainterType>(EnumPainter.IDLE);
  const [userPaint, setUserPaint] = createSignal(false);
  const [tool, setTool] = createSignal<EnumToolsType>(EnumTools.NONE);
  const [penSize, setPenSize] = createSignal(INITIAL_PEN_SIZE);
  const [canvasRef, setCanvasRef] = createSignal<HTMLCanvasElement>();
  const [penColor, setPenColor] = createSignal<string>(DEFAULT_PALETTE[0]);

  const setEraser = () => setTool(EnumTools.ERASER);
  const setPen = () => setTool(EnumTools.PEN);
  const unsetTool = () => setTool(EnumTools.NONE);

  const tunePenSize = (size: number) => {
    setPenSize(size);
  };

  const changePenSize = (addSize: number) => {
    const newSize = penSize() + addSize;
    if (newSize < MIN_PEN_SIZE || newSize > MAX_PEN_SIZE) return;
    setPenSize(newSize);
  };

  const switchPainting = () => {
    setUserPaint((p) => !p);
  };

  const startPainting = () => {
    if (userPaint()) setPainter(EnumPainter.PAINTING);
  };

  const paint = (e: MouseEvent) => {
    const canvas = canvasRef();
    if (painterState() === EnumPainter.PAINTING && canvas) {
      const x = e.pageX - canvas.offsetLeft;
      const y = e.pageY - canvas.offsetTop;

      hash.work({ x, y, paintSize: penSize(), tool: tool(), penColor: penColor() });
    }
  };

  const stopPainting = () => {
    if (painterState() === EnumPainter.PAINTING) {
      setPainter(EnumPainter.IDLE);
    }
  };

  createEffect(() => {
    const canvas = canvasRef();
    if (canvas) {
      canvas.addEventListener("mousedown", startPainting);
      canvas.addEventListener("mousemove", paint);
      canvas.addEventListener("mouseup", stopPainting);
      canvas.addEventListener("mouseleave", stopPainting);
    }
  });

  onCleanup(() => {
    const canvas = canvasRef();
    if (canvas) {
      canvas.removeEventListener("mousedown", startPainting);
      canvas.removeEventListener("mousemove", paint);
      canvas.removeEventListener("mouseup", stopPainting);
      canvas.removeEventListener("mouseleave", stopPainting);
    }
  });

  return {
    penSize,
    tunePenSize,
    changePenSize,
    setCanvasRef,
    switchPainting,
    painterState,
    userPaint,
    setEraser,
    setPen,
    unsetTool,
    tool,
    penColor,
    setPenColor,
  };
};
export default usePainter;
