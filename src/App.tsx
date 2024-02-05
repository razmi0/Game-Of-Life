import { CanvasWrapper } from "./components/Wrappers";
import { onMount, createSignal, Show, createEffect } from "solid-js";
import useScreen from "./hooks/useScreen";
import useHash from "./hooks/useHash";
import useColors from "./hooks/useColors";
import useClock from "./hooks/useClock";
import { SimpleButton } from "./components/Buttons";
import DebuggerPanel from "./components/DebuggerPanel";
import useData from "./hooks/useData";
import Drawer from "./components/Drawer";

let canvas: HTMLCanvasElement;
const App = () => {
  const [ctx, setCtx] = createSignal<CanvasRenderingContext2D>();
  const screen = useScreen(); // context candidate
  const data = useData();
  const { findColor } = useColors(screen.nCell());
  const { updateHash, readHashAndDraw, resetHash } = useHash(screen, data, findColor, ctx);

  const run = () => {
    updateHash();
    readHashAndDraw();
    data.incrementGeneration();
  };

  const reset = () => {
    resetHash();
    data.resetGeneration();
  };

  createEffect(() => {
    if (screen.width) readHashAndDraw();
  });

  const { clock, changeSpeed } = useClock(run);

  onMount(() => {
    setCtx(canvas.getContext("2d")!);
    run();
  });

  return (
    <>
      <Show when={import.meta.env.DEV}>
        <DebuggerPanel>
          <SimpleButton handler={run}>run hash</SimpleButton>
          <SimpleButton handler={clock.switchPlayPause}>{clock.play ? "pause" : "play"}</SimpleButton>
        </DebuggerPanel>
      </Show>
      <Drawer clock={clock} data={data} reset={reset} changeSpeed={changeSpeed} />
      <CanvasWrapper>
        <canvas class="bg-slate-500" width={screen.width} height={screen.height} ref={canvas}></canvas>
      </CanvasWrapper>
    </>
  );
};

export default App;
