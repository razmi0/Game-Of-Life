import { Accessor, createEffect } from "solid-js";

type Hash32Type = Uint32Array & { [index: number]: number };
type Hash32 = Prettify<Hash32Type>;

export default function useColors(nCell: Accessor<number>) {
  //

  let colors = new Uint32Array(nCell()) as Hash32;
  const predefinedColors = ["#3B82F6", "#6366F1", "#EC4899", "#F59E0B"];

  // const resizeColors = () => {
  //   const pastSize = colors.length; // old screen.nCell()
  //   const newSize = nCell(); // new screen.nCell()
  //   if (newSize <= pastSize) return;
  //   const diff = newSize - pastSize;
  //   const newDiffColors = new Uint32Array(diff).map(() => packColor(randomColor())) as Hash32;
  //   const newColors = new Uint32Array(diff + pastSize) as Hash32;
  //   newColors.set(colors, 0);
  //   newColors.set(newDiffColors, pastSize);
  //   colors = newColors;
  // };

  // createEffect(() => {
  //   console.log("color : ", nCell());
  // });

  const randomColor = () => {
    let color = "";
    const random = Math.random() * 100;
    if (random <= 25) color = predefinedColors[0];
    if (random > 25 && random <= 50) color = predefinedColors[1];
    if (random > 50 && random <= 75) color = predefinedColors[2];
    if (random > 75) color = predefinedColors[3];
    return color;
  };

  const packColor = (hex: string) => {
    hex = hex.replace(/^#/, "");
    const bigint = parseInt(hex, 16); // to RGB
    return bigint >>> 0; // to Uint32 unsigned
  };

  const unpackColor = (color: number) => {
    const hex = color?.toString(16).padStart(6, "0") ?? "000"; // to hex
    return `#${hex}`;
  };

  const findColor = (i: number) => unpackColor(colors[i]);

  const initColors = () => {
    let i = 0;
    while (i < colors.length) {
      colors[i] = packColor(randomColor());
      i++;
    }
  };

  initColors();

  return { findColor };
}
