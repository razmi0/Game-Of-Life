import { JSX } from "solid-js/jsx-runtime";
import { useGameOfLife } from "../helpers";
import { Component, createEffect, createSignal, onMount } from "solid-js";

const CELL_WIDTH = 20 as const;
let canvaRef: HTMLCanvasElement;

const Canvas = () => {
  const [winWidth, winHeight, drawGrid, nextGen] = useGameOfLife(CELL_WIDTH);

  onMount(() => {
    const ctx = canvaRef.getContext("2d");
    if (!ctx) return;
    drawGrid(ctx);
  });

  const handleClick = () => {
    const ctx = canvaRef.getContext("2d");
    if (!ctx) return;
    nextGen();
    drawGrid(ctx);
  };

  return (
    <CanvasWrapper>
      <button class="absolute m-7 p-3 rounded-md bg-slate-100" onClick={handleClick}>
        Start
      </button>
      <canvas class="bg-slate-500" width={winWidth()} height={winHeight()} ref={(el) => (canvaRef = el)}></canvas>
    </CanvasWrapper>
  );
};

const CanvasWrapper: Component<{ children: JSX.Element }> = (props) => {
  return <div>{props.children}</div>;
};

export default Canvas;
