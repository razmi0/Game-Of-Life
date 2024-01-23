import useScreen from "./useScreen";
import Drawer from "./components/Drawer";
import { CanvasWrapper } from "./components/Wrappers";
import { onMount, createSignal } from "solid-js";
import useClock from "./useClock";
import useGameOfLife from "./useGameOfLife";
import Draggable from "./components/Drawer/draggable/Draggable";

let canvas: HTMLCanvasElement;
const App = () => {
  // const [ctx, setCtx] = createSignal<CanvasRenderingContext2D>();
  // const screen = useScreen();
  // const board = useGameOfLife(screen, ctx);
  // const clock = useClock(board.nextCycle);

  // onMount(() => {
  //   setCtx(canvas.getContext("2d")!);
  //   board.draw();
  // });

  const [enabled, setEnabled] = createSignal(false);

  return (
    <>
      {/* <Drawer clock={clock} board={board} />
      <CanvasWrapper>
        <canvas class="bg-slate-500" width={screen.width} height={screen.height} ref={canvas}></canvas>
      </CanvasWrapper> */}
      <Draggable enabled={enabled()}>
        <div class="bg-green-500 h-40 w-40 text-center">
          out
          <button class="bg-red-500 h-6 w-6" onClick={() => setEnabled((p) => !p)}>
            in
          </button>
        </div>
      </Draggable>
      <Draggable>
        <div class="bg-yellow-500 h-40 w-40 text-center">
          out
          <button class="bg-red-500 h-6 w-6">in</button>
        </div>
      </Draggable>
    </>
  );
};

export default App;
