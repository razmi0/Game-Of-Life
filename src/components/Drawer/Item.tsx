import type { JSX, Component } from "solid-js";

type ItemProps = {
  children: JSX.Element;
};
const Item: Component<ItemProps> = (props) => {
  return (
    <div class="text-sm text-dw-150 my-3 px-3 py-1 rounded-md hover:bg-dw-300 hover:text-dw-100 ">{props.children}</div>
  );
};

export default Item;
