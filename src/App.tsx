import { onMount, createSignal, Show, createMemo } from "solid-js";
import useGrid from "./hooks/useGrid";
import useHash from "./hooks/useHash";
import useColors from "./hooks/useColors";
import usePainter from "./hooks/usePainter";
import useClock from "./hooks/useClock";
import useBoardData from "./hooks/useBoardData";
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
  const boardData = useBoardData();
  const { findColor } = useColors(grid.nCell);
  const { updateHash, drawHash, resetHash, paintCell } = useHash(grid, boardData, findColor, ctx);
  const { changePenSizeMultiplicator, tunePenSizeMultiplicator, penSizeMultiplicator, setCanvasRef } =
    usePainter(paintCell);

  const run = () => {
    if (!hasStarted()) setHasStarted(true);
    updateHash();
    drawHash();
    boardData.incrementGeneration();
  };

  const reset = () => {
    setHasStarted(false);
    if (gameLoop.play) gameLoop.switchPlayPause();
    resetHash();
    boardData.resetGeneration();
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
    setCanvasRef(canvas);
    run();
  });

  const gridInfo = createMemo(() => {
    return { width: grid.wH(), height: grid.wW() };
  });

  const debug = false;

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
        /** boardData */
        generation={boardData.generation}
        nAlive={boardData.nAlive}
        nDead={boardData.nDead}
        randomness={boardData.randomness}
        tuneRandom={boardData.tuneRandom}
        changeRandom={boardData.changeRandom}
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
        gridInfo={gridInfo()}
      />
      <canvas class="bg-black" width={grid.wW()} height={grid.wH()} ref={canvas}></canvas>
    </>
  );
};

export default App;
