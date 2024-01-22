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

  const fn = (e: MouseEvent) => {
    setDrag((p) => !p);
    console.log(drag());
  };
  const [drag, setDrag] = createSignal(true);

  return (
    <>
      {/* <Drawer clock={clock} board={board} />
      <CanvasWrapper>
        <canvas class="bg-slate-500" width={screen.width} height={screen.height} ref={canvas}></canvas>
      </CanvasWrapper> */}
      <Draggable enabled={drag()}>
        <div class="bg-red-500 w-20 h-20">
          <div class="bg-yellow-500 w-10 h-10"></div>
        </div>
      </Draggable>
      <Draggable enabled={drag()}>
        <div class="bg-green-500 w-20 h-20">
          <div class="bg-blue-500 w-10 h-10"></div>
        </div>
      </Draggable>
    </>
  );
};

export default App;
