import { Component } from "solid-js";
import { JSX } from "solid-js/jsx-runtime";

type BodyProps = {
  children: JSX.Element | JSX.Element[];
};
const Body: Component<BodyProps> = (props: BodyProps) => {
  return <div>{props.children}</div>;
};
export default Body;
