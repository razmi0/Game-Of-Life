import { createEffect, onCleanup } from "solid-js";
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
    },
  }) as readonly [Store<ScreenStoreState>, SetStoreFunction<ScreenStoreState>];

  createEffect(() => {
    window.addEventListener("resize", screen.updateScreen);
    onCleanup(() => window.removeEventListener("resize", screen.updateScreen));
  });

  console.log("Initial nbr of cells", screen.nCell());

  return screen;
}
