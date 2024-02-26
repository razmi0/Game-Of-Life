import { createEffect, createSignal, onCleanup, onMount } from "solid-js";

const MAX_PEN_SIZE = 50;
const MIN_PEN_SIZE = 1;

enum Painter {
  IDLE = "idle",
  PAINTING = "painting",
  ERASING = "erasing",
}

type PenShape = "round" | "square";

type PaintTools = {
  pen: () => void;
  eraser: () => void;
};

const usePainter = (work: (x: number, y: number, paintSize: number) => void) => {
  const [painter, setPainter] = createSignal(Painter.IDLE);
  const [penShape, setPenShape] = createSignal<PenShape>("square");
  const [penSizeMultiplicator, setPenSizeMultiplicator] = createSignal(1);
  const [canvasRef, setCanvasRef] = createSignal<HTMLCanvasElement>();

  const switchShape = () => setPenShape((p) => (p === "round" ? "square" : "round"));

  const tunePenSizeMultiplicator = (size: number) => {
    setPenSizeMultiplicator(size);
  };

  const changePenSizeMultiplicator = (addSize: number) => {
    const newSize = penSizeMultiplicator() + addSize;
    if (newSize < MIN_PEN_SIZE || newSize > MAX_PEN_SIZE) return;
    setPenSizeMultiplicator(newSize);
  };

  const startErasing = () => {
    setPainter(Painter.ERASING);
  };

  const startPainting = () => {
    setPainter(Painter.PAINTING);
  };

  const paint = (e: MouseEvent) => {
    const canvas = canvasRef();
    if (painter() === Painter.PAINTING && canvas)
      work(e.pageX - canvas.offsetLeft, e.pageY - canvas.offsetTop, penSizeMultiplicator());
  };

  const stopPainting = () => {
    if (painter() === Painter.PAINTING || painter() === Painter.ERASING) setPainter(Painter.IDLE);
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

  return { penSizeMultiplicator, tunePenSizeMultiplicator, changePenSizeMultiplicator, setCanvasRef, switchShape };
};
export default usePainter;
