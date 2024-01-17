import { Component, JSX, Show, createEffect, createSignal } from "solid-js";

type ButtonProps = {
  classList?: { [key: string]: boolean };
  onClick: () => void;
  indicator?: JSX.Element;
  children: JSX.Element;
};
const Button: Component<ButtonProps> = (props) => {
  return (
    <button
      class="p-1 rounded-sm bg-slate-100 border-2 h-fit text-sm flex gap-2 text-slate-900 hover:bg-slate-200 hover:border-slate-200 font-semibold"
      onClick={props.onClick}
      classList={props.classList}
    >
      {props.children}
      <Show when={props.indicator}>
        <span class="text-green-500 text-sm font-bold">{props.indicator}</span>
      </Show>
    </button>
  );
};

type ControlsProps = {
  clock: ClockState;
};
export const ControlsGroup: Component<ControlsProps> = (props) => {
  const handleQueue = () => props.clock.queueTicks(50);
  return (
    <div class="flex flex-row gap-1 absolute m-5 opacity-80 flex-wrap">
      <Button
        classList={{ ["animate-pulse"]: props.clock.play }}
        onClick={props.clock.playPause}
        indicator={props.clock.tick}
      >
        PlayPause
      </Button>
      <Button
        onClick={props.clock.addSpeed}
        indicator={
          <Show when={props.clock.clocked} fallback={<>0</>}>
            {props.clock.speed}
          </Show>
        }
      >
        Add Speed
      </Button>
      <Button onClick={props.clock.subSpeed}>Sub Speed</Button>
      <Button onClick={handleQueue} indicator={props.clock.queue.toString()}>
        Add 50 to queue
      </Button>
      <Button onClick={props.clock.switchClocked}>
        <Show when={props.clock.clocked} fallback={<>Free</>}>
          On Clock
        </Show>
      </Button>
    </div>
  );
};
export default Button;
