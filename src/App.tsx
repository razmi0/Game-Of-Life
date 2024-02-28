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
import { unwrap } from "solid-js/store";

let canvas: HTMLCanvasElement;

const App = () => {
  const [ctx, setCtx] = createSignal<CanvasRenderingContext2D>();
  const [hasStarted, setHasStarted] = createSignal(false);

  const grid = useGrid(); // context candidate
  const boardData = useBoardData();
  const { findColor, palette, addColor, patchColor, removeColor, applyRandomColors } = useColors(grid.nCell);
  const { updateHash, drawHash, resetHash, paintCell, drawAllHash } = useHash(grid, boardData, findColor, ctx);
  const painter = usePainter(paintCell);

  const run = () => {
    if (!hasStarted()) setHasStarted(true);
    updateHash();
    drawHash();
    boardData.incrementGeneration();
  };

  const applyColors = () => {
    applyRandomColors();
    drawAllHash();
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
    painter.setCanvasRef(canvas);
    run();
  });

  const gridInfo = createMemo(() => {
    return { width: grid.wW(), height: grid.wH() };
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
          <SimpleButton handler={() => console.log(unwrap(palette))}>log palette</SimpleButton>
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
        /** painter */
        selectedTool={painter.tool()}
        setEraser={painter.setEraser}
        setPen={painter.setPen}
        unsetTool={painter.unsetTool}
        paintingState={painter.userPaint()}
        switchPainting={painter.switchPainting}
        penSize={painter.penSize()}
        tunePenSize={painter.tunePenSize}
        changePenSize={painter.changePenSize}
        /** colors */
        palette={palette}
        addColor={addColor}
        patchColor={patchColor}
        removeColor={removeColor}
        applyColors={applyColors}
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
