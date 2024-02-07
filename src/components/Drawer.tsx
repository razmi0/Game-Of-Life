import { For, Show, createMemo, createSignal } from "solid-js";
import { ICON_SIZE, MAX_ALIVE_RANDOM, MAX_DELAY, MIN_ALIVE_RANDOM, MIN_DELAY } from "../data";
import { IconButton, SimpleButton } from "./Buttons";
import Wrapper from "./Drawer/Content";
import Group from "./Drawer/Group";
import Header from "./Drawer/Header";
import Item from "./Drawer/Item";
import SimpleRange from "./Drawer/Range";
import Separator from "./Drawer/Separator";
import Icon from "./Icons";
import type { Accessor, Component, JSXElement } from "solid-js";
import useShorcuts, { type Shortcut } from "../hooks/useShorcuts";

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

  const shorcuts: Shortcut[] = [
    {
      key: " ",
      action: () => props.switchPlayPause(),
    },
    {
      key: "k",
      action: () => props.switchPlayPause(),
    },
    {
      key: "r",
      action: () => props.reset(),
    },
    {
      key: "ArrowUp",
      action: () => props.changeSpeed(props.speed + 10),
    },
    {
      key: "ArrowDown",
      action: () => props.changeSpeed(props.speed - 10),
    },
    {
      key: "ArrowRight",
      action: () => props.randomize(props.randomness + 2),
    },
    {
      key: "ArrowLeft",
      action: () => props.randomize(props.randomness - 2),
    },
    {
      key: "a",
      action: () => trigger(),
      ctrl: true,
    },
  ];
  useShorcuts(shorcuts);

  const { xl } = ICON_SIZE;

  const playPauseText = () => (props.play ? "pause" : "play");
  const PlayPauseIcon = () => (
    <Show when={props.play} fallback={<Icon width={ICON_SIZE.xl} name="play" />}>
      <Icon width={ICON_SIZE.xl} name="pause" />
    </Show>
  );

  const fps = (speed: number) => {
    if (speed === 0) return "max fps";
    const lbl = 1000 / speed;
    return lbl > 200 ? "200 fps" : Math.floor(lbl) + " fps";
  };

  const SpeedTooltip = () => {
    const [output, setOutput] = createSignal(fps(props.speed));

    const handleInputOutput = (e: Event) => {
      setOutput(fps((e.target as HTMLInputElement).valueAsNumber));
    };

    const handleSpeedChange = (e: Event) => {
      const newSpeed = (e.target as HTMLInputElement).valueAsNumber;
      props.changeSpeed(newSpeed);
    };

    return (
      <div class="mt-3 flex items-center min-w-48">
        <SimpleRange
          milestones={["10", "20", "200"]}
          onChange={handleSpeedChange}
          onInput={handleInputOutput}
          value={props.speed}
          max={MAX_DELAY}
          min={MIN_DELAY}
          class="w-56 rotate-180"
          aria="speed"
        />
        <div class="whitespace-nowrap text-yellow-400 text-sm font-bold translate-y-[-9px] h-full w-16 text-right">
          {output()}
        </div>
      </div>
    );
  };

  const RandomTooltip = () => {
    const [output, setOutput] = createSignal(props.randomness);

    const handleRandomChange = (e: Event) => {
      const newRandom = (e.target as HTMLInputElement).valueAsNumber;
      props.randomize(newRandom);
    };

    const handleInputOutput = (e: Event) => {
      const newRandom = (e.target as HTMLInputElement).valueAsNumber;
      setOutput(newRandom);
    };

    return (
      <div class="flex flex-col gap-4 mt-3 min-w-48">
        <div class="flex gap-2 items-start ">
          <SimpleRange
            milestones
            onChange={handleRandomChange}
            onInput={handleInputOutput}
            value={props.randomness}
            min={MIN_ALIVE_RANDOM}
            max={MAX_ALIVE_RANDOM}
            aria="randomness"
            class="w-56"
          />
          <div class="translate-y-[1px] text-yellow-400 text-sm font-bold h-full w-8 text-right">{output()}</div>
        </div>
        <SimpleButton class="bg-dw-300 w-full hover:bg-dw-200" handler={props.reset}>
          reset game
        </SimpleButton>
      </div>
    );
  };

  const stats: Accessor<StatsTooltipData[]> = createMemo(() => [
    {
      label: "generation",
      value: props.generation,
    },
    {
      label: "speed",
      value: `${props.speed}ms (${fps(props.speed)})`,
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
          showTooltipOnClick
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
          showTooltipOnClick
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
        <Item showTooltipOnClick tooltip={<StatsTooltip title={"Stats"} data={stats()} />}>
          <Icon width={xl} name="wave" />
        </Item>
      </Group>
      <Separator />
    </Wrapper>
  );
}

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

type StatsTooltipData = { label: string; value: JSXElement; separator?: boolean };
type StatsTooltipProps = {
  data: StatsTooltipData[];
  title?: JSXElement;
};
const StatsTooltip: Component<StatsTooltipProps> = (props) => {
  return (
    <div class="flex flex-col p-5 w-fit bg-dw-500 min-w-72 resize">
      <Show when={!!props.title}>
        <h4 class="uppercase monserrat tracking-widest text-xs font-bold mb-2 text-dw-200">{props.title}</h4>
      </Show>
      <div class="gap-1">
        <For each={props.data}>
          {(data) => (
            <>
              <div class="flex items-center justify-between z-10 w-full flex-nowrap ">
                <span class="w-20 text-left">{data.label}</span>
                <span class="whitespace-nowrap w-20 text-right text-yellow-400">{data.value}</span>
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
