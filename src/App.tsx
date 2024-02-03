import { CanvasWrapper } from "./components/Wrappers";
import { onMount, createSignal } from "solid-js";
import useScreen from "./hooks/useScreen";
import useGameOfLife from "./hooks/useGameOfLife";
import useHash from "./hooks/useHash";
import useColors from "./hooks/useColors";
import useClock from "./hooks/useClock";
import { SimpleButton } from "./components/Buttons";
import DebuggerPanel from "./components/DebuggerPanel";

let canvas: HTMLCanvasElement;
const App = () => {
  const [ctx, setCtx] = createSignal<CanvasRenderingContext2D>();
  const screen = useScreen();
  const board = useGameOfLife(screen);
  const findColor = useColors(screen.nCell());
  const hash = useHash(screen, board, findColor, ctx);
  const clock = useClock(hash.run);

  onMount(() => {
    setCtx(canvas.getContext("2d")!);
    board.draw();
    board.initHash();
  });

  return (
    <>
      <DebuggerPanel>
        <SimpleButton handler={hash.run}>run hash</SimpleButton>
        <SimpleButton handler={clock.playPause}>{clock.play ? "pause" : "play"}</SimpleButton>
      </DebuggerPanel>
      {/* <Drawer clock={clock} board={board} /> */}
      <CanvasWrapper>
        <canvas class="bg-slate-500" width={screen.width} height={screen.height} ref={canvas}></canvas>
      </CanvasWrapper>
    </>
  );
};

export default App;
