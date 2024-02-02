import useScreen from "./useScreen";
import Drawer from "./components/Drawer";
import { CanvasWrapper } from "./components/Wrappers";
import { onMount, createSignal, createEffect, For, Component } from "solid-js";
import useClock from "./useClock";
import useGameOfLife from "./useGameOfLife";
import { SimpleButton } from "./components/Buttons";
import { useHash } from "./useHash";
import DebuggerPanel from "./components/DebuggerPanel";

let canvas: HTMLCanvasElement;
const App = () => {
  const [ctx, setCtx] = createSignal<CanvasRenderingContext2D>();
  const screen = useScreen();
  const board = useGameOfLife(screen, ctx);
  const clock = useClock(board.nextCycle);
  const hash = useHash(screen, board);

  onMount(() => {
    setCtx(canvas.getContext("2d")!);
    board.draw();
    board.initHash();
  });

  return (
    <>
      <DebuggerPanel>
        <SimpleButton handler={hash.updateHash}>evolve hash</SimpleButton>
      </DebuggerPanel>
      <Drawer clock={clock} board={board} />
      <CanvasWrapper>
        <canvas class="bg-slate-500" width={screen.width} height={screen.height} ref={canvas}></canvas>
      </CanvasWrapper>
    </>
  );
};

export default App;
