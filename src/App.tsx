// AUTHOR : ANAS ABOU ALAIWI
// EMAIL : ANAS.ABOUALAIWI at GMAIL dot COM

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
  const color = useColors(grid.nCell);

  const hash = useHash(grid, boardData, color, ctx);
  const painter = usePainter(hash.paintCell);

  const run = () => {
    // app signal + 2 hash methods + 1 boardData method
    if (!hasStarted()) setHasStarted(true);
    hash.updateHash();
    hash.drawHash();
    boardData.incrementGeneration();
  };

  const resetBlank = () => {
    // 1 app signal + 1 hash method + 1 boardData method + 1 colors method + 1 clock method
    setHasStarted(false);
    if (gameLoop.play) gameLoop.switchPlayPause();
    hash.resetBlankHash();
    color.applyRandomColors();
    color.setBackgroundColor("black");
    boardData.resetGeneration();
  };

  const gameLoop = useClock(run);

  const applyColors = () => {
    // 1 color method + 1 hash method
    color.applyRandomColors();
    hash.drawAllHash();
  };

  const reset = () => {
    // 1 app signal + 1 clock method + 1 hash method +  1 boardData method ##A##
    setHasStarted(false);
    if (gameLoop.play) gameLoop.switchPlayPause();
    hash.resetHash();
    boardData.resetGeneration();
  };

  const { navInfo, refreshBatteryInfo } = useAgent();

  const batteryClock = useClock(refreshBatteryInfo);
  batteryClock.tuneSpeed(BATTERY_REFRESH_INTERVAL);
  batteryClock.switchPlayPause(); // start the battery checking clock

  onMount(() => {
    setCtx(canvas.getContext("2d")!);
    painter.setCanvasRef(canvas);
    run();
  });

  const gridInfo = createMemo(() => {
    return { width: grid.wW(), height: grid.wH() };
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
        cellSize={grid.cellSize()}
        tuneCellSize={grid.tuneCellSize}
        changeCellSize={grid.changeCellSize}
        shape={grid.shape.selectedShape}
        setShapeSquare={grid.shape.setSquare}
        setShapeCircle={grid.shape.setCircle}
        seeGrid={grid.gridSpacing.seeGrid}
        cellSpacing={grid.gridSpacing.spacing}
        tuneGridSpacing={grid.gridSpacing.tuneSpacing}
        changeGridSpacing={grid.gridSpacing.changeSpacing}
        toggleGrid={grid.toggleGrid}
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
        resetBlank={resetBlank}
        hasStarted={hasStarted()}
        navigator={navInfo()}
        gridInfo={gridInfo()}
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
