import { type JSX, type Component, Show } from "solid-js";

type ItemProps = {
  children: JSX.Element;
  right?: JSX.Element;
  left?: JSX.Element;
  label?: JSX.Element;
  onClick?: () => void;
  classes?: string;
  hover?: boolean;
};
const Item: Component<ItemProps> = (props) => {
  if (props.hover === undefined) props.hover = true;
  const hasLbl = !!props.label;
  const hasLeft = !!props.left;
  return (
    <>
      <div class="flex flex-col justify-center items-start text-dw-150">
        <Show when={hasLbl}>
          <label class="text-sm w-full mt-2">{props.label}</label>
        </Show>
        <div
          class={`flex items-center gap-2 text-sm w-full py-1 rounded-md h-8 cursor-pointer ps-2 ${props.classes}`}
          classList={{ ["h-11 leading-none"]: hasLbl, ["hover:bg-dw-300 hover:text-dw-100"]: props.hover }}
          onClick={props.onClick}
        >
          <Show when={hasLeft}>{props.left}</Show>
          {props.children}
          <div class="flex flex-col items-center">
            <Show when={props.right}>{props.right}</Show>
          </div>
        </div>
      </div>
    </>
  );
};

export default Item;
