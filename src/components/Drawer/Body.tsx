import { Component } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";

type BodyProps = {
  children: JSX.Element | JSX.Element[];
};
const Body: Component<BodyProps> = (props: BodyProps) => {
  return <div class="bg-slate-700 ps-3">{props.children}</div>;
};
export default Body;
