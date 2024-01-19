import { type JSX, type Component, Show } from "solid-js";

type ItemProps = {
  children: JSX.Element;
  right?: JSX.Element;
  left?: JSX.Element;
  label?: string;
  onClick?: () => void;
};
const Item: Component<ItemProps> = (props) => {
  return (
    <div
      class="flex items-center gap-2 text-sm text-dw-150 py-1 rounded-md hover:bg-dw-300 hover:text-dw-100 h-8 cursor-pointer px-2"
      classList={{ ["h-10 leading-none"]: !!props.label }}
      onClick={props.onClick}
    >
      <Show when={!!props.left}>{props.left}</Show>
      {props.children}

      <div class="flex flex-col">
        <Show when={props.right}>
          {props.right}
          <Show when={!!props.label}>
            <label class="text-xs ">{props.label}</label>
          </Show>
        </Show>
      </div>
    </div>
  );
};

export default Item;
