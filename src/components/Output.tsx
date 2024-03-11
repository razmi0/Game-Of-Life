import { JSXElement } from "solid-js";

type OutputProps = {
  children: JSXElement;
  class?: string;
  classList?: Record<string, boolean | undefined>;
};
const Output = (props: OutputProps) => {
  return (
    <div
      class={`text-yellow-400 text-sm font-bold h-full w-16 tabular-nums text-center whitespace-nowrap ${props.class}`}
      classList={props.classList || {}}
    >
      {props.children}
    </div>
  );
};

export default Output;
