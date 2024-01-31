import type { Component, JSX, VoidComponent } from "solid-js";

export const CanvasWrapper: Component<{ children: JSX.Element }> = (props) => {
  return <div>{props.children}</div>;
};

export const Overlay: VoidComponent = () => {
  return <div class="backdrop-blur-sm bg-white/10 w-full h-full"></div>;
};
