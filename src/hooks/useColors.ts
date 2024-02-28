import { Accessor, createEffect } from "solid-js";
import { createStore } from "solid-js/store";
import { DEFAULT_PALETTE } from "../data";

type Hash32Type = Uint32Array & { [index: number]: number };
type Hash32 = Prettify<Hash32Type>;

export default function useColors(nCell: Accessor<number>) {
  const [palette, setPalette] = createStore({
    randomColors: DEFAULT_PALETTE, // colors
  });

  /**
   * @description Colors array (Uint32Array grid)
   */
  let colors = new Uint32Array(nCell()) as Hash32;

  /**
   * @description Sync colors array with the new cell size calling resizeColors
   */
  createEffect(() => {
    if (nCell() !== colors.length) resizeColors();
  });

  /**
   * @description Resize colors array (Uint32Array grid) to match the new cell size. Grab hex from randomColor & pack it to Uint32
   *
   */
  const resizeColors = () => {
    const newSize = nCell();
    const pastSize = colors.length;
    if (newSize === pastSize) return;
    else if (newSize < pastSize) {
      colors = colors.copyWithin(0, newSize);
    } else {
      const diff = newSize - pastSize;
      const newDiffColors = new Uint32Array(diff).map(() => packColor(randomColor())) as Hash32;
      const newColors = new Uint32Array(diff + pastSize) as Hash32;

      newColors.set(colors, 0);
      newColors.set(newDiffColors, pastSize);
      colors = newColors;
    }
  };

  /**
   * @description Choose a random color from the palette
   * @returns hex color
   */
  const randomColor = () => {
    let color = "";
    const random = Math.random() * 100;
    if (random <= 25) color = palette.randomColors[0];
    if (random > 25 && random <= 50) color = palette.randomColors[1];
    if (random > 50 && random <= 75) color = palette.randomColors[2];
    if (random > 75) color = palette.randomColors[3];
    return color;
  };

  /**
   * @description Convert hex to Uint32
   * @param hex
   * @returns
   */
  const packColor = (hex: string) => {
    hex = hex.replace(/^#/, "");
    const bigint = parseInt(hex, 16); // to RGB
    return bigint >>> 0; // to Uint32 unsigned
  };

  /**
   * @description Convert Uint32 to hex
   * @param color
   * @returns
   */
  const unpackColor = (color: number) => {
    const hex = color?.toString(16).padStart(6, "0") ?? "000"; // to hex
    return `#${hex}`;
  };

  /**
   * @description Find color by index in colors array (Uint32Array grid)
   * @param i
   * @returns
   */
  const findColor = (i: number) => unpackColor(colors[i]);

  /**
   * @description Initialize colors array with random colors
   */
  const initColors = () => {
    let i = 0;
    while (i < colors.length) {
      colors[i] = packColor(randomColor());
      i++;
    }
  };

  initColors();

  return { findColor, palette: palette.randomColors };
}
