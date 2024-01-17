import { onCleanup, onMount } from "solid-js";
import { createStore } from "solid-js/store";
import type { SetStoreFunction, Store } from "solid-js/store";
import { CELL_WIDTH } from "./data";

export default function useScreen() {
  const [screen, setScreen] = createStore({
    width: window.innerWidth,
    height: window.innerHeight,
    nRow: () => Math.floor(window.innerWidth / CELL_WIDTH) + 1,
    nCol: () => Math.floor(window.innerHeight / CELL_WIDTH) + 1,
    nCell: () => screen.nRow() * screen.nCol(),
    updateScreen: () => {
      setScreen("width", window.innerWidth);
      setScreen("height", window.innerHeight);
      console.log("New nbr of cells", screen.nCell());
    },
  }) as readonly [Store<ScreenStoreState>, SetStoreFunction<ScreenStoreState>];

  onMount(() => {
    window.addEventListener("resize", screen.updateScreen);
    onCleanup(() => window.removeEventListener("resize", screen.updateScreen));
  });

  return screen;
}
