// AUTHOR : ANAS ABOU ALAIWI
// EMAIL : ANAS.ABOUALAIWI at GMAIL dot COM

import { onMount, createSignal, Show, createMemo, createEffect } from "solid-js";
import useGrid from "./hooks/useGrid";
import useHash from "./hooks/useHash";
import useColors from "./hooks/useColors";
import usePainter from "./hooks/usePainter";
import useTimer from "./hooks/useTimer";
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

  const grid = useGrid(ctx); // context candidate
  const boardData = useBoardData();
  const color = useColors(grid.nCell);

  const hash = useHash(grid, boardData, color, ctx);
  const painter = usePainter(hash.paintCell);

  const run = () => {
    if (!hasStarted()) setHasStarted(true);
    hash.updateHash();
    hash.drawHash();
    boardData.incrementGeneration();
  };

  const gameLoop = useTimer(run);

  const applyColors = () => {
    color.applyRandomColors();
    hash.drawAllHash();
  };

  const reset = () => {
    setHasStarted(false);
    hash.setIsWorkingOnHash(true);
    if (gameLoop.play) gameLoop.switchPlayPause();
    hash.resetHash();
    hash.setIsWorkingOnHash(false);
    boardData.resetGeneration();
  };

  const { navInfo, refreshBatteryInfo } = useAgent();

  const batteryTimer = useTimer(refreshBatteryInfo);
  batteryTimer.tuneSpeed(BATTERY_REFRESH_INTERVAL);
  batteryTimer.switchPlayPause(); // start the battery checking clock

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
          <SimpleButton handler={() => console.log(unwrap(color.palette))}>log palette</SimpleButton>
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
        cellSize={grid.sizes.cell}
        tuneCellSize={grid.sizes.tuneCellSize}
        changeCellSize={grid.sizes.changeCellSize}
        shape={grid.shape.selectedShape}
        setShapeSquare={grid.shape.setSquare}
        setShapeCircle={grid.shape.setCircle}
        gridVisibility={grid.gridSpacing.visibility}
        cellSpacing={grid.gridSpacing.spacing}
        tuneGridSpacing={grid.gridSpacing.tuneSpacing}
        changeGridSpacing={grid.gridSpacing.changeSpacing}
        toggleGridVisibility={grid.toggleGrid}
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
        penColor={painter.penColor()}
        changePenColor={painter.setPenColor}
        /** colors */
        palette={color.palette}
        maxColors={color.maxColors}
        addColor={color.addColor}
        patchColor={color.patchColor}
        removeColor={color.removeColor}
        applyColors={applyColors}
        backgroundColor={color.backgroundColor()}
        changeBackgroundColor={color.setBackgroundColor}
        seeCorpse={color.seeCorpse()}
        toggleCorpse={color.toggleCorpse}
        /** hash & misc */
        reset={reset}
        hasStarted={hasStarted()}
        navigator={navInfo()}
        gridInfo={gridInfo()}
        isWorkingOnHash={hash.isWorkingOnHash}
      />
      <canvas
        style={`background-color : ${color.backgroundColor()}`}
        width={grid.wW()}
        height={grid.wH()}
        ref={canvas}
      ></canvas>
    </>
  );
};

export default App;
