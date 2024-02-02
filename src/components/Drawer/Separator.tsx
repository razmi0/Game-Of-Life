import { Show } from "solid-js";

type SeparatorProps = {
  classes?: string;
  show?: boolean;
};
export default function Separator(props: SeparatorProps) {
  return (
    <Show when={props.show ?? true}>
      <div class={`w-5 h-1 m-auto bg-dw-300 rounded-full my-1 ${props.classes || ""}`} />
    </Show>
  );
}
