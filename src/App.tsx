import { CanvasWrapper } from "./components/Wrappers";
import { onMount, createSignal, Show, createEffect } from "solid-js";
import useGrid from "./hooks/useGrid";
import useHash from "./hooks/useHash";
import useColors from "./hooks/useColors";
import useClock from "./hooks/useClock";
import useData from "./hooks/useData";
import useAgent from "./hooks/useAgent";
import { SimpleButton } from "./components/Buttons";
import DebuggerPanel from "./components/DebuggerPanel";
import Drawer from "./components/Drawer";
import { BATTERY_REFRESH_INTERVAL } from "./data";

let canvas: HTMLCanvasElement;

const App = () => {
  const [ctx, setCtx] = createSignal<CanvasRenderingContext2D>();
  const [hasStarted, setHasStarted] = createSignal(false);

  const grid = useGrid(); // context candidate
  const data = useData();
  const { findColor } = useColors(grid.nCell);
  const { updateHash, drawHash, resetHash } = useHash(grid, data, findColor, ctx);

  const run = () => {
    if (!hasStarted()) setHasStarted(true);
    updateHash();
    drawHash();
    data.incrementGeneration();
  };

  const reset = () => {
    setHasStarted(false);
    if (gameLoop.play) gameLoop.switchPlayPause();
    resetHash();
    data.resetGeneration();
  };

  const changeCellSizeAndReset = (newSize: number) => {
    grid.changeCellSize(newSize);
    reset();
  };

  const { navInfo, refreshBatteryInfo } = useAgent();

  const batteryClock = useClock(refreshBatteryInfo);
  batteryClock.tuneSpeed(BATTERY_REFRESH_INTERVAL);
  batteryClock.switchPlayPause(); // start the battery checking clock

  const gameLoop = useClock(run);

  onMount(() => {
    setCtx(canvas.getContext("2d")!);
    run();
  });

  const debug = true;

  return (
    <>
      <Show when={import.meta.env.DEV && debug}>
        <DebuggerPanel>
          <SimpleButton handler={batteryClock.switchPlayPause}>battery refresh : {batteryClock.speed}</SimpleButton>
          <SimpleButton handler={run}>run hash</SimpleButton>
          <SimpleButton handler={gameLoop.switchPlayPause}>{gameLoop.play ? "pause" : "play"}</SimpleButton>
          <SimpleButton
            handler={() => {
              console.log("cells : ", grid.nCell());
              console.log("rows : ", grid.nRow());
              console.log("cols : ", grid.nCol());
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
        /** grid */
        cellSize={grid.cellSize()}
        tuneCellSize={grid.tuneCellSize}
        changeCellSize={changeCellSizeAndReset}
        /** gameLoop */
        speed={gameLoop.speed}
        play={gameLoop.play}
        tuneSpeed={gameLoop.tuneSpeed}
        changeSpeed={gameLoop.changeSpeed}
        switchPlayPause={gameLoop.switchPlayPause}
        /** hash & misc */
        reset={reset}
        hasStarted={hasStarted()}
        navigator={navInfo()}
      />
      <CanvasWrapper>
        <canvas class="bg-black" width={grid.wW()} height={grid.wH()} ref={canvas}></canvas>
      </CanvasWrapper>
    </>
  );
};

export default App;
