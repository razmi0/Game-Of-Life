import type { JSX, Component } from "solid-js";

type ItemProps = {
  children: JSX.Element;
};
const Item: Component<ItemProps> = (props) => {
  return <>{props.children}</>;
};

export default Item;
