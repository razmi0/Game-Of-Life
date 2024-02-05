import { Show, createSignal, For, createMemo } from "solid-js";
import Wrapper from "./Drawer/Content";
import Header from "./Drawer/Header";
import Group from "./Drawer/Group";
import Item from "./Drawer/Item";
import Separator from "./Drawer/Separator";
import { IconButton, SimpleButton } from "./Buttons";
import Icon from "./Icons";
import { ICON_SIZE, MAX_ALIVE_RANDOM, MAX_DELAY, MIN_ALIVE_RANDOM, MIN_DELAY } from "../data";
import type { Component, JSX, JSXElement, VoidComponent } from "solid-js";

type DrawerProps = {
  hasStarted: boolean;
  play: boolean;
  speed: number;
  randomness: number;
  generation: number;
  nAlive: number;
  nDead: number;
  reset: () => void;
  changeSpeed: (newTime: number) => void;
  randomize: (newRandom: number) => void;
  switchPlayPause: () => void;
};

export default function Drawer(props: Prettify<DrawerProps>) {
  const [isOpen, setIsOpen] = createSignal(true);
  const trigger = () => setIsOpen((p) => !p);

  const fps = () => {
    if (props.speed === 0) return "max";
    return (1000 / props.speed).toFixed(2);
  };

  const { xl } = ICON_SIZE;

  const playPauseText = () => (props.play ? "pause" : "play");
  const PlayPauseIcon = () => (
    <Show when={props.play} fallback={<Icon width={ICON_SIZE.xl} name="play" />}>
      <Icon width={ICON_SIZE.xl} name="pause" />
    </Show>
  );

  const SpeedTooltip = () => {
    const handleSpeedChange = (e: Event) => {
      const newSpeed = (e.target as HTMLInputElement).valueAsNumber;
      props.changeSpeed(newSpeed);
    };
    return (
      <div class="mt-3 flex gap-2 items-center justify-center min-w-48 max-w-48">
        <Range class="w-8/12" onChange={handleSpeedChange} value={props.speed} max={MAX_DELAY} min={MIN_DELAY} />
        <span class="whitespace-nowrap text-dw-200 text-sm font-bold text-right translate-y-[2px]">{`${fps()} fps`}</span>
      </div>
    );
  };

  const RandomTooltip = () => {
    const handleRandomChange = (e: Event) => {
      const newRandom = (e.target as HTMLInputElement).valueAsNumber;
      props.randomize(newRandom);
    };
    return (
      <div class="flex flex-col gap-4 mt-3 min-w-48 max-w-48">
        <div class="flex gap-2 items-start justify-center">
          <Range onChange={handleRandomChange} value={props.randomness} min={MIN_ALIVE_RANDOM} max={MAX_ALIVE_RANDOM} />
          <span class="translate-y-[2px] text-dw-200 text-sm font-bold text-right">{props.randomness}</span>
        </div>
        <SimpleButton class="bg-dw-300 w-full hover:bg-dw-200" handler={props.reset}>
          reset game
        </SimpleButton>
      </div>
    );
  };

  const stats = createMemo(() => [
    {
      label: "generation",
      value: props.generation,
    },
    {
      label: "speed",
      value: props.speed,
    },
    {
      label: "randomness",
      value: props.randomness,
      separator: true,
    },
    {
      label: "total cells",
      value: props.nAlive + props.nDead,
    },
    {
      label: "alive cells",
      value: `${props.nAlive} (${Math.floor((props.nAlive / (props.nAlive + props.nDead)) * 100)}%)`,
    },
  ]);

  return (
    <Wrapper trigger={trigger} open={isOpen()}>
      <Header>
        <IconButton onClick={trigger} width={xl} name="chevron" class="hover:bg-dw-300 p-1 rounded-full" />
      </Header>
      <Separator />
      <Group>
        <Item
          onClick={props.switchPlayPause}
          tooltip={
            <div class="w-fit pe-3 ps-3 flex place-items-center h-full bg-dw-500">
              <p>{playPauseText()}</p>
            </div>
          }
        >
          <PlayPauseIcon />
        </Item>

        <Item
          tooltip={
            <StandardTooltip title="reset">
              <p class="min-w-48">reset the data to a new original fresh random data</p>
            </StandardTooltip>
          }
          onClick={props.reset}
        >
          <Icon width={xl} name="reset" />
        </Item>
      </Group>
      <Separator />
      <Group>
        <Item
          tooltip={
            <StandardTooltip title={`speed`}>
              <p>change the delay between two frames affecting FPS</p>
              <SpeedTooltip />
            </StandardTooltip>
          }
        >
          <Icon width={xl} name="speed" />
        </Item>
        <Item
          tooltip={
            <StandardTooltip title="randomness">
              <p>change the ratio between alive cells and dead cells when reseting the data</p>
              <RandomTooltip />
            </StandardTooltip>
          }
        >
          <Icon width={xl} name="random" />
        </Item>
      </Group>
      <Separator />
      <Group>
        <Item tooltip={<StatsTooltip title={"Stats"} data={stats()} />}>
          <Icon width={xl} name="wave" />
        </Item>
      </Group>
      <Separator />
    </Wrapper>
  );
}

type RangeProps = {
  onChange: (e: Event) => void;
  value?: number;
  min?: number;
  max?: number;
  class?: string;
};
const Range: VoidComponent<RangeProps> = (props) => {
  const min = props.min === 0 ? 0 : props.min || 10;
  const max = props.max || 1000;
  return (
    <input
      type="range"
      class={`w-full mt-2 ${props.class || ""}`}
      onChange={(e) => props.onChange(e)}
      max={max}
      min={min}
      value={props.value}
    />
  );
};

type StandardTooltipProps = {
  children: JSXElement;
  title?: JSXElement;
};
const StandardTooltip: Component<StandardTooltipProps> = (props) => (
  <div class="flex h-fit w-fit p-5 bg-dw-500 flex-col">
    <Show when={!!props.title}>
      <h4 class="uppercase monserrat tracking-widest text-xs font-bold mb-2 text-dw-200">{props.title}</h4>
    </Show>
    <div class="text-balance">{props.children}</div>
  </div>
);

type StatsTooltipProps = {
  data: { label: string; value: JSXElement; separator?: boolean }[];
  title?: JSXElement;
};
const StatsTooltip: Component<StatsTooltipProps> = (props) => {
  return (
    <div class="flex flex-col p-5 w-fit bg-dw-500">
      <Show when={!!props.title}>
        <h4 class="uppercase monserrat tracking-widest text-xs font-bold mb-2 text-dw-200">{props.title}</h4>
      </Show>
      <div class="gap-1">
        <For each={props.data}>
          {(data) => (
            <>
              <div class="flex items-center justify-between z-10 w-full flex-nowrap">
                <span class="whitespace-nowrap w-20 text-left">{data.label}</span>
                <span class="whitespace-nowrap w-20 text-right">{data.value}</span>
              </div>
              <Show when={data.separator}>
                <Separator classes="w-full my-3 h-[2px]" />
              </Show>
            </>
          )}
        </For>
      </div>
    </div>
  );
};
