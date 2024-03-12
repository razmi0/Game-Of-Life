import { onMount, createSignal, Show, createMemo } from "solid-js";
import useGrid from "./hooks/useGrid";
import useHash from "./hooks/useHash";
import useColors from "./hooks/useColors";
import usePainter from "./hooks/usePainter";
import useTimer from "./hooks/useTimer";
import useBoardData from "./hooks/useBoardData";
import useAgent from "./hooks/useAgent";
import { SimpleButton } from "./components/ui/Buttons";
import DebuggerPanel from "./components/ui/DebuggerPanel";
import Drawer from "./components/Drawer/Drawer";
import { BATTERY_REFRESH_INTERVAL, STEP_SPACING } from "./data";

let boardRef: HTMLCanvasElement;
let gridRef: HTMLCanvasElement;

const App = () => {
  const [boardCtx, setBoardCtx] = createSignal<CanvasRenderingContext2D>();
  const [gridCtx, setGridCtx] = createSignal<CanvasRenderingContext2D>();
  const [hasStarted, setHasStarted] = createSignal(false);

  const grid = useGrid(gridCtx);
  const boardData = useBoardData();
  const color = useColors(grid.board.nCell);
  const hash = useHash(grid, boardData, color, boardCtx);
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
    setBoardCtx(boardRef.getContext("2d")!);
    setGridCtx(gridRef.getContext("2d")!);
    painter.setCanvasRef(boardRef);
    hash.drawAllHash();
    grid.drawGrid();
  });

  const gridInfo = createMemo(() => {
    return { width: grid.board.wW, height: grid.board.wH };
  });

  const debug = true;

  return (
    <>
      <Show when={import.meta.env.DEV && debug}>
        <DebuggerPanel>
          <div class="w-full">
            <p>Grid color : {grid.gridSpacing.gridColor}</p>
            <p>Spacing : {grid.gridSpacing.spacing} </p>
          </div>
          <SimpleButton class="border-dw-100 border-2 rounded-md" handler={grid.toggleVisibility}>
            Visibility : {grid.gridSpacing.visibility.toString()}
          </SimpleButton>
          <SimpleButton handler={grid.drawGrid} class="border-dw-100 border-2 rounded-md">
            Draw grid
          </SimpleButton>
          <SimpleButton handler={hash.drawAllHash} class="border-dw-100 border-2 rounded-md">
            drawAllHash
          </SimpleButton>
          <div class="flex flex-col gap-1">
            <SimpleButton
              handler={() => {
                grid.changeSpacing(STEP_SPACING);
              }}
              class="border-dw-100 border-2 rounded-md"
            >
              Add spacing
            </SimpleButton>
            <SimpleButton
              handler={() => {
                grid.changeSpacing(-STEP_SPACING);
                grid.drawGrid();
              }}
              class="border-dw-100 border-2 rounded-md"
            >
              Remove spacing
            </SimpleButton>
          </div>
        </DebuggerPanel>
      </Show>
      <Drawer
        boardData={boardData}
        grid={grid}
        gameLoop={gameLoop}
        painter={painter}
        color={color}
        applyColors={applyColors}
        /** misc */
        reset={reset}
        drawAllHash={hash.drawAllHash}
        hasStarted={hasStarted()}
        navigator={navInfo()}
        gridInfo={gridInfo()}
      />
      {/* BOARD */}
      <canvas
        style={{ "background-color": color.backgroundColor() }}
        width={grid.board.wW}
        height={grid.board.wH}
        ref={boardRef}
      />
      {/* GRID.BOARD */}
      <canvas
        style={{ "background-color": "transparent", position: "absolute", "pointer-events": "none" }}
        width={grid.board.wW}
        height={grid.board.wH}
        ref={gridRef}
      />
    </>
  );
};

export default App;
