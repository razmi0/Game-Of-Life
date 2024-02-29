import Separator from "./Separator";
import { For, Show } from "solid-js";
import type { Component, JSXElement } from "solid-js";

type StandardTooltipProps = {
  children?: JSXElement;
  title?: JSXElement;
  class?: string;
};
export type StatsTooltipData = { label: string; value: JSXElement; separator?: boolean };
type StatsTooltipProps = {
  data: StatsTooltipData[];
  title?: JSXElement;
};

const StandardTooltip: Component<StandardTooltipProps> = (props) =>
  // prettier-ignore
  <div class={`flex h-fit w-fit py-3 px-4 bg-dw-500 flex-col ${props.class || ""}`}> 
      <Show when={!!props.title}>
        <h4 class="uppercase monserrat tracking-widest text-xs font-bold mb-1 text-dw-200">{props.title}</h4>
        <Separator class="w-full h-[1px]"/>
      </Show>
      <Show when={!!props.children}>
      <div class="text-balance">{props.children}</div></Show>
    </div>;

export const StatsTooltip: Component<StatsTooltipProps> = (props) => {
  return (
    <div class="flex flex-col p-5 w-fit bg-dw-500 min-w-72">
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
