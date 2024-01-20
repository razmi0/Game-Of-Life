import useScreen from "./useScreen";
import Drawer from "./components/Drawer";
import { CanvasWrapper } from "./components/Wrappers";
import { onMount, type Component, createSignal } from "solid-js";
import useClock from "./useClock";
import useGameOfLife from "./useGameOfLife";

let canvas: HTMLCanvasElement;

const App: Component = () => {
  const [ctx, setCtx] = createSignal<CanvasRenderingContext2D>();
  const screen = useScreen();
  const board = useGameOfLife(screen, ctx);
  const clock = useClock(board.nextCycle);

  onMount(() => {
    setCtx(canvas.getContext("2d")!);
    board.draw();
  });

  return (
    <>
      <Drawer clock={clock} board={board} />
      <CanvasWrapper>
        <canvas class="bg-slate-500" width={screen.width} height={screen.height} ref={canvas}></canvas>
      </CanvasWrapper>
    </>
  );
};

export default App;
