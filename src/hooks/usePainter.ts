import { createEffect, createSignal, onCleanup, onMount } from "solid-js";
import { INITIAL_CELL_SIZE, INITIAL_PEN_SIZE, MAX_PEN_SIZE, MIN_PEN_SIZE } from "../data";

enum Painter {
  IDLE = "idle",
  PAINTING = "painting",
}

export enum Tools {
  PEN = "pen",
  ERASER = "eraser",
  NONE = "none",
}

const usePainter = (work: (x: number, y: number, paintSize: number, tool: Tools) => void) => {
  const [painterState, setPainter] = createSignal(Painter.IDLE);
  const [userPaint, setUserPaint] = createSignal(false);
  const [tool, setTool] = createSignal<Tools>(Tools.NONE);
  const [penSize, setPenSize] = createSignal(INITIAL_PEN_SIZE);
  const [canvasRef, setCanvasRef] = createSignal<HTMLCanvasElement>();

  const setEraser = () => setTool(Tools.ERASER);
  const setPen = () => setTool(Tools.PEN);
  const unsetTool = () => setTool(Tools.NONE);

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
    if (userPaint()) setPainter(Painter.PAINTING);
  };

  const paint = (e: MouseEvent) => {
    const canvas = canvasRef();
    if (painterState() === Painter.PAINTING && canvas)
      work(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop, penSize(), tool());
  };

  const stopPainting = () => {
    if (painterState() === Painter.PAINTING) setPainter(Painter.IDLE);
  };

  createEffect(() => {
    const canvas = canvasRef();
    if (canvas) {
      console.log("effect");
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
  };
};
export default usePainter;
