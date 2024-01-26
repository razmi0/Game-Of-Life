import { type Component } from "solid-js";
import { type JSX } from "solid-js/jsx-runtime";

type BodyProps = {
  children: JSX.Element | JSX.Element[];
};
const Body: Component<BodyProps> = (props: BodyProps) => {
  return <>{props.children}</>;
};
export default Body;
