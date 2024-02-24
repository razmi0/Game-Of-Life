import { createEffect, createSignal, onCleanup, onMount } from "solid-js";

enum Painter {
  IDLE = "idle",
  PAINTING = "painting",
  ERASING = "erasing",
}

type PaintTools = {
  pen: () => void;
  eraser: () => void;
};

const usePainter = (canvasRef: HTMLCanvasElement | null, work: (x: number, y: number) => void) => {
  const [painter, setPainter] = createSignal(Painter.IDLE);

  const startErasing = () => {
    setPainter(Painter.ERASING);
  };

  const startPainting = () => {
    setPainter(Painter.PAINTING);
  };

  const paint = (e: MouseEvent) => {
    if (painter() === Painter.PAINTING && canvasRef)
      work(e.pageX - canvasRef?.offsetLeft, e.pageY - canvasRef?.offsetTop);
  };

  const stopPainting = () => {
    if (painter() === Painter.PAINTING || painter() === Painter.ERASING) setPainter(Painter.IDLE);
  };

  createEffect(() => {
    if (canvasRef) {
      console.log("effect");
      canvasRef.addEventListener("mousedown", startPainting);
      canvasRef.addEventListener("mousemove", paint);
      canvasRef.addEventListener("mouseup", stopPainting);
      canvasRef.addEventListener("mouseleave", stopPainting);
    }
  });

  onCleanup(() => {
    if (canvasRef) {
      canvasRef.removeEventListener("mousedown", startPainting);
      canvasRef.removeEventListener("mousemove", paint);
      canvasRef.removeEventListener("mouseup", stopPainting);
      canvasRef.removeEventListener("mouseleave", stopPainting);
    }
  });
};
export default usePainter;
