import { Component, JSX } from "solid-js";

type ButtonProps = {
  classList?: { [key: string]: boolean };
  onClick: () => void;
  children: JSX.Element;
};
const Button: Component<ButtonProps> = (props) => {
  return (
    <button
      class="p-1 rounded-sm bg-slate-100 border-2 h-8 text-sm"
      onClick={props.onClick}
      classList={props.classList}
    >
      {props.children}
    </button>
  );
};

type ControlsProps = {
  clock: ClockState;
};
export const ControlsGroup: Component<ControlsProps> = (props) => {
  return (
    <div class="flex flex-row gap-1 absolute m-5 opacity-80 ">
      <Button classList={{ ["border-green-500 animate-pulse"]: props.clock.play }} onClick={props.clock.playPause}>
        PlayPause
      </Button>
      <Button onClick={props.clock.addSpeed}>Add Speed</Button>
      <Button onClick={props.clock.subSpeed}>Sub Speed</Button>
      <Button onClick={props.clock.addTick}>Next Gen</Button>
    </div>
  );
};
export default Button;
