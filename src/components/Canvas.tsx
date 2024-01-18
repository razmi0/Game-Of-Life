import { createSignal, onMount, VoidComponent } from "solid-js";
import { CanvasWrapper } from "./Wrappers";
import { ControlGroup } from "./Buttons";
import useGameOfLife from "../useGameOfLife";
import useClock from "../useClock";

let canvas: HTMLCanvasElement;

const Canvas: VoidComponent<CanvasProps> = (props) => {
  const [ctx, setCtx] = createSignal<CanvasRenderingContext2D>();
  const board = useGameOfLife(props.screen, ctx);
  const clock = useClock(board.nextCycle);

  onMount(() => {
    setCtx(canvas.getContext("2d")!);
    board.draw();
  });

  return (
    <CanvasWrapper>
      {/* <ControlGroup clock={clock} reset={board.reset} /> */}
      <canvas class="bg-slate-500" width={props.screen.width} height={props.screen.height} ref={canvas}></canvas>
    </CanvasWrapper>
  );
};

export default Canvas;
