import { Component, For, JSXElement, Show } from "solid-js";
import Separator from "./Separator";

type Milestones = [string | number, string | number, string | number, string | number];
type MilestoneIndexes = 2 | 3 | 4;
const milestoneLayout = {
  4: [
    "start-0",
    "start-1/3 -translate-x-1/2 rtl:translate-x-1/2",
    "start-2/3 -translate-x-1/2 rtl:translate-x-1/2",
    "end-0",
  ],
  3: ["start-0", "start-1/2 -translate-x-1/2 rtl:translate-x-1/2", "end-0"],
  2: ["start-0", "end-0"], // milestoneLayout[2][0] = "start-0"
};

export type RangeProps = {
  onChange: (e: Event) => void;
  value?: number;
  min?: number;
  max?: number;
  class?: string;
  aria?: string;
  milestones?: boolean | Partial<Milestones>;
};

const SimpleRange = (props: RangeProps) => {
  const min = props.min === 0 ? 0 : props.min || 10;
  const max = props.max || 1000;

  const milestoneIsBoolean = typeof props.milestones === "boolean" ? true : false;
  const milestonesSize = Array.isArray(props.milestones) ? props.milestones.length : 0;

  return (
    <div class={`relative mb-5`}>
      <label for={props.aria} class="sr-only">
        Labels range
      </label>
      <input
        id={props.aria}
        type="range"
        value={props.value}
        min={min}
        max={max}
        class={`h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700 accent-yellow-400 ${props.class || ""}`} // prettier-ignore
        onChange={(e) => props.onChange(e)}
      />
      <Show when={milestoneIsBoolean && props.milestones}>
        <For each={[min, max]}>
          {(milestone, i) => (
            <>
              <span class={`text-sm text-gray-500 dark:text-gray-400 absolute ${milestoneLayout[2][i()]} -bottom-6`}>
                {milestone}
              </span>
            </>
          )}
        </For>
      </Show>
      <Show when={!milestoneIsBoolean && milestonesSize > 1}>
        <For each={props.milestones as Milestones}>
          {(milestone, i) => (
            <>
              <span
                class={`text-sm text-gray-500 dark:text-gray-400 absolute ${milestoneLayout[milestonesSize as MilestoneIndexes][i()]} -bottom-6`} // prettier-ignore
              >
                {milestone}
              </span>
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
