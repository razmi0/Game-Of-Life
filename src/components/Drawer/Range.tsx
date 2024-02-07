import { Component, For, JSXElement, Show } from "solid-js";
import Separator from "./Separator";

export type RangeProps = {
  onChange: (e: Event) => void;
  value?: number;
  min?: number;
  max?: number;
  class?: string;
  aria?: string;
  milestones?: boolean;
};

const SimpleRange = (props: RangeProps) => {
  const min = props.min === 0 ? 0 : props.min || 10;
  const max = props.max || 1000;

  return (
    <div class="relative mb-5">
      <label for={props.aria} class="sr-only">
        Labels range
      </label>
      <input
        id={props.aria}
        type="range"
        value={props.value}
        min={min}
        max={max}
        class={`w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-yellow-400 ${
          props.class || ""
        }`}
        onChange={(e) => props.onChange(e)}
      />
      <Show when={props.milestones}>
        <For each={[min, max]}>
          {(milestone, i) => (
            <>
              {/* prettier-ignore */}
              <span class={`text-sm text-gray-500 dark:text-gray-400 absolute ${i() === 0 ? "start-0" : "end-0"} -bottom-6`}>{milestone}</span>
            </>
          )}
        </For>
      </Show>
    </div>
  );
};
// const Range: VoidComponent<RangeProps> = (props) => {
//   const min = props.min === 0 ? 0 : props.min || 10;
//   const max = props.max || 1000;
//   return (
//     <input
//       type="range"
//       class={`w-full mt-2 ${props.class || ""}`}
//       onChange={(e) => props.onChange(e)}
//       max={max}
//       min={min}
//       value={props.value}
//     />
//   );
// };

export default SimpleRange;
