import { CanvasWrapper } from "./components/Wrappers";
import { onMount, createSignal, Show, createEffect } from "solid-js";
import useScreen from "./hooks/useScreen";
import useHash from "./hooks/useHash";
import useColors from "./hooks/useColors";
import useClock from "./hooks/useClock";
import useData from "./hooks/useData";
import { SimpleButton } from "./components/Buttons";
import DebuggerPanel from "./components/DebuggerPanel";
import Drawer from "./components/Drawer";
import { getNavigatorInfo } from "./helpers";

let canvas: HTMLCanvasElement;
const [navigatorInfo, setNavigatorInfo] = createSignal<UserAgentInfo | null>(null); // context candidate

const App = () => {
  const [ctx, setCtx] = createSignal<CanvasRenderingContext2D>();
  const [hasStarted, setHasStarted] = createSignal(false);
  const screen = useScreen(); // context candidate
  const data = useData();
  const { findColor } = useColors(screen.nCell);
  const { updateHash, drawHash, resetHash } = useHash(screen, data, findColor, ctx);

  const run = () => {
    if (!hasStarted()) setHasStarted(true);
    updateHash();
    drawHash();
    data.incrementGeneration();
  };

  const reset = () => {
    setHasStarted(false);
    if (clock.play) clock.switchPlayPause();
    resetHash();
    data.resetGeneration();
  };

  const changeCellSizeAndReset = (newSize: number) => {
    screen.changeCellSize(newSize);
    reset();
  };

  const clock = useClock(run);

  onMount(() => {
    setCtx(canvas.getContext("2d")!);
    run();
  });

  getNavigatorInfo().then((content) => setNavigatorInfo(content));

  const debug = false;

  return (
    <>
      <Show when={import.meta.env.DEV && debug}>
        <DebuggerPanel>
          <SimpleButton handler={run}>run hash</SimpleButton>
          <SimpleButton handler={clock.switchPlayPause}>{clock.play ? "pause" : "play"}</SimpleButton>
          <SimpleButton
            handler={() => {
              console.log("cells : ", screen.nCell());
              console.log("rows : ", screen.nRow());
              console.log("cols : ", screen.nCol());
            }}
          >
            log
          </SimpleButton>
        </DebuggerPanel>
      </Show>
      <Drawer
        /** data */
        generation={data.generation}
        nAlive={data.nAlive}
        nDead={data.nDead}
        randomness={data.randomness}
        tuneRandom={data.tuneRandom}
        changeRandom={data.changeRandom}
        /** screen */
        cellSize={screen.cellSize()}
        tuneCellSize={screen.tuneCellSize}
        changeCellSize={changeCellSizeAndReset}
        /** clock */
        speed={clock.speed}
        play={clock.play}
        tuneSpeed={clock.tuneSpeed}
        changeSpeed={clock.changeSpeed}
        switchPlayPause={clock.switchPlayPause}
        /** hash & misc */
        reset={reset}
        hasStarted={hasStarted()}
        navigator={navigatorInfo()}
      />
      <CanvasWrapper>
        <canvas class="bg-black" width={screen.wW()} height={screen.wH()} ref={canvas}></canvas>
      </CanvasWrapper>
    </>
  );
};

export default App;
