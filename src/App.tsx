import useScreen from "./useScreen";
import Drawer from "./components/Drawer";
import { CanvasWrapper } from "./components/Wrappers";
import { onMount, type Component, createSignal } from "solid-js";
import useClock from "./useClock";
import useGameOfLife from "./useGameOfLife";

let canvas: HTMLCanvasElement;

const App: Component = () => {
  const screen = useScreen();
  const [ctx, setCtx] = createSignal<CanvasRenderingContext2D>();
  const board = useGameOfLife(screen, ctx);
  const clock = useClock(board.nextCycle);

  onMount(() => {
    setCtx(canvas.getContext("2d")!);
    board.draw();
  });

  return (
    <>
      <Drawer playPause={clock.playPause} reset={board.reset} />
      <CanvasWrapper>
        <canvas class="bg-slate-500" width={screen.width} height={screen.height} ref={canvas}></canvas>
      </CanvasWrapper>
    </>
  );
};

export default App;
