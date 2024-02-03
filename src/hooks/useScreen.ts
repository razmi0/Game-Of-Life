import { createMemo, onCleanup, onMount } from "solid-js";
import { createStore, type SetStoreFunction, type Store } from "solid-js/store";
import { CELL_WIDTH } from "../data";

export default function useScreen() {
  const [screen, setScreen] = createStore({
    width: window.innerWidth,
    height: window.innerHeight,
    /**
     *  Number of cells in a row (number of cols)
     */
    nRow: createMemo(() => Math.floor(window.innerWidth / CELL_WIDTH) + 1),
    /**
     * Number of cells in a col ( number of rows )
     */
    nCol: createMemo(() => Math.floor(window.innerHeight / CELL_WIDTH) + 1),
    /** Total number of cells */
    nCell: () => screen.nRow() * screen.nCol(),
    updateScreen: () => {
      setScreen("width", window.innerWidth);
      setScreen("height", window.innerHeight);
    },
  }) as readonly [Store<ScreenStoreState>, SetStoreFunction<ScreenStoreState>];

  onMount(() => {
    window.addEventListener("resize", screen.updateScreen);
    onCleanup(() => window.removeEventListener("resize", screen.updateScreen));
  });

  console.log("Cells : ", screen.nCell());
  console.log("Number of cols : ", screen.nRow());
  console.log("Number of rows : ", screen.nCol());

  return screen;
}
