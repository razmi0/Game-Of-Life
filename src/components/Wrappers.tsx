import { Component, JSX } from "solid-js";

export const CanvasWrapper: Component<{ children: JSX.Element }> = (props) => {
  return <div>{props.children}</div>;
};
