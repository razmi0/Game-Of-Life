import { onMount } from "solid-js";
import { useGameOfLife } from "../useGameOfLife";
import { CanvasWrapper } from "./Wrappers";
import { ControlsGroup } from "./Buttons";
import useClock from "../useClock";

const CELL_WIDTH = 10 as const;
let canvas: HTMLCanvasElement;
let ctx: CanvasRenderingContext2D;

const Canvas = () => {
  const [winWidth, winHeight, drawGrid, nextGen] = useGameOfLife(CELL_WIDTH);
  const clock = useClock([nextGen, () => drawGrid(ctx)]);

  onMount(() => {
    ctx = canvas.getContext("2d")!;
    drawGrid(ctx);
  });

  return (
    <CanvasWrapper>
      <ControlsGroup clock={clock} />
      <canvas class="bg-slate-500" width={winWidth()} height={winHeight()} ref={canvas}></canvas>
    </CanvasWrapper>
  );
};

export default Canvas;
