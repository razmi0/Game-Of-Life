import { CanvasWrapper } from "./components/Wrappers";
import { onMount, createSignal, Show } from "solid-js";
import useScreen from "./hooks/useScreen";
import useGameOfLife from "./hooks/useGameOfLife";
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

  //   switchAliveIncrease: () => {
  //     setData("nAliveIncrease", !data.nAliveIncrease);
  //   },
  //   switchDeadIncrease: () => {
  //     setData("nDeadIncrease", !data.nDeadIncrease);
  //   },

  const run = () => {
    updateHash();
    readHashAndDraw();
    data.incrementGeneration();
  };

  const reset = () => {
    resetHash();
    data.resetGeneration();
  };

  const clock = useClock(run);

  onMount(() => {
    setCtx(canvas.getContext("2d")!);
    run();
  });

  return (
    <>
      <Show when={import.meta.env.DEV}>
        <DebuggerPanel>
          <SimpleButton handler={run}>run hash</SimpleButton>
          <SimpleButton handler={clock.playPause}>{clock.play ? "pause" : "play"}</SimpleButton>
        </DebuggerPanel>
      </Show>
      <Drawer clock={clock} data={data} reset={reset} />
      <CanvasWrapper>
        <canvas class="bg-slate-500" width={screen.width} height={screen.height} ref={canvas}></canvas>
      </CanvasWrapper>
    </>
  );
};

export default App;
