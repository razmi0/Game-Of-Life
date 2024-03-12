import type { Component, JSXElement } from "solid-js";
import { For, Show } from "solid-js";
import Separator from "../ui/Separator";

type StandardTooltipProps = {
  children?: JSXElement;
  title?: JSXElement;
  class?: string;
  innerContentClass?: string;
};
export type StatsTooltipData = { label: string; value: JSXElement; separator?: boolean };
type StatsTooltipProps = {
  data: StatsTooltipData[];
  title?: JSXElement;
};

const StandardTooltip: Component<StandardTooltipProps> = (props) =>
  // prettier-ignore
  <div class={`flex flex-col tooltip pb-3 gap-3 ${props.class || ""}`}> 
      <Show when={!!props.title}>
        <h4 class="flex items-center justify-between w-full uppercase monserrat tracking-widest text-xs font-bold text-dw-200 border-b border-b-dw-300 min-h-10 px-3">{props.title}</h4>
      </Show>
      <Show when={!!props.children}>
      <div class={`text-balance h-full w-full px-3 ${props.innerContentClass || ""}`}>{props.children}</div></Show>
    </div>;

export const StatsTooltip: Component<StatsTooltipProps> = (props) => {
  return (
    <div class="flex flex-col w-fit min-w-72 tooltip">
      <Show when={!!props.title}>
        <div class="flex flex-row justify-between">
          <h4 class="uppercase monserrat tracking-widest text-xs font-bold mb-2 text-dw-200">{props.title}</h4>
          <Separator class="w-full h-[1px]" />
        </div>
      </Show>
      <div class="gap-1">
        <For each={props.data}>
          {(data) => (
            <>
              <div class="flex items-center justify-between z-10 w-full flex-nowrap">
                <span class="w-fit text-left">{data.label}</span>
                <span class="whitespace-nowrap w-24 text-right text-yellow-400 tabular-nums">{data.value}</span>
              </div>
              <Show when={data.separator}>
                <Separator class="w-full my-3 h-[1px]" />
              </Show>
            </>
          )}
        </For>
      </div>
    </div>
    // </Draggable>
  );
};

export default StandardTooltip;
