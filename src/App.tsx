import useScreen from "./useScreen";
import Drawer from "./components/Drawer";
import { CanvasWrapper } from "./components/Wrappers";
import { onMount, createSignal, createEffect, JSXElement, For } from "solid-js";
import useClock from "./useClock";
import useGameOfLife from "./useGameOfLife";
import Draggable from "./components/Drawer/draggable/Draggable";
import { createStore, produce, unwrap } from "solid-js/store";

let canvas: HTMLCanvasElement;
const App = () => {
  const [ctx, setCtx] = createSignal<CanvasRenderingContext2D>();
  const screen = useScreen();
  const board = useGameOfLife(screen, ctx);
  const clock = useClock(board.nextCycle);

  onMount(() => {
    setCtx(canvas.getContext("2d")!);
    board.draw();
  });
  // type DragState = {
  //   enabled: [boolean, boolean];
  //   toggle: (index: number) => void;
  // };

  // const [drag, setDrag] = createStore<DragState>({
  //   enabled: [true, true],
  //   toggle: (index: number) => {
  //     setDrag("enabled", [index], (p) => !p);
  //     console.log(drag.enabled);
  //   },
  // });
  // const [resetOnEnd, setResetOnEnd] = createSignal(false);
  // const toogleReset = () => setResetOnEnd((p) => !p);
  // // const toggleDrag = (i: number) => setDrag([]);

  // createEffect(() => console.log("createEffect app drag : ", unwrap(drag.enabled)));

  // console.log("start with", drag.enabled);

  // const Cards = [
  //   <div class="bg-red-500 w-56 h-64 text-right">
  //     drag
  //     <div class="bg-yellow-500 w-fit h-fit" onClick={() => drag.toggle(0)}>
  //       enabled {drag.enabled[0] ? "on" : "off"}
  //     </div>
  //   </div>,
  //   <div class="bg-green-500 w-56 h-64 text-right">
  //     drag
  //     <div class="bg-blue-500 w-fit h-fit" onClick={() => drag.toggle(1)}>
  //       enabled {drag.enabled[1] ? "on" : "off"}
  //     </div>
  //   </div>,
  // ] as JSXElement[];

  return (
    <>
      <Drawer clock={clock} board={board} />
      <CanvasWrapper>
        <canvas class="bg-slate-500" width={screen.width} height={screen.height} ref={canvas}></canvas>
      </CanvasWrapper>
      {/* <div class="p-10 bg-dw-500">
        <For each={Cards}>
          {(card, i) => (
            <Draggable enabled={false} resetOnDragEnd={resetOnEnd()}>
              {card}
            </Draggable>
          )}
        </For>
      </div> */}
    </>
  );
};

export default App;
