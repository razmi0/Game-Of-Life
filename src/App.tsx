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
  const [hasStarted, setHasStarted] = createSignal(false);
  const screen = useScreen(); // context candidate
  const data = useData();
  const { findColor } = useColors(screen.nCell());
  const { updateHash, readHashAndDraw, resetHash } = useHash(screen, data, findColor, ctx);

  const run = () => {
    if (!hasStarted()) setHasStarted(true);
    updateHash();
    readHashAndDraw();
    data.incrementGeneration();
  };

  const reset = () => {
    setHasStarted(false);
    if (clock.play) clock.switchPlayPause();
    resetHash();
    readHashAndDraw();
    data.resetGeneration();
  };

  const changeRandomization = (newRandom: number) => {
    data.setRandom(newRandom);
  };

  createEffect(() => {
    if (screen.width && hasStarted()) readHashAndDraw();
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
      <Drawer
        generation={data.generation}
        nAlive={data.nAlive}
        nDead={data.nDead}
        randomness={data.randomness}
        speed={clock.speed}
        play={clock.play}
        randomize={changeRandomization}
        switchPlayPause={clock.switchPlayPause}
        reset={reset}
        changeSpeed={changeSpeed}
        hasStarted={hasStarted()}
      />
      <CanvasWrapper>
        <canvas class="bg-black" width={screen.width} height={screen.height} ref={canvas}></canvas>
      </CanvasWrapper>
    </>
  );
};

export default App;
