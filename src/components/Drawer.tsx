import { Show, createSignal } from "solid-js";
import Wrapper from "./Drawer/Content";
import Header from "./Drawer/Header";
import Group from "./Drawer/Group";
import Item from "./Drawer/Item";
import Separator from "./Drawer/Separator";
import { IconButton } from "./Buttons";
import Icon from "./Icons";
import { ICON_SIZE, MAX_ALIVE_RANDOM, MAX_DELAY, MIN_ALIVE_RANDOM, MIN_DELAY } from "../data";
import type { Component, JSX, VoidComponent } from "solid-js";

type DrawerProps = {
  clock: ClockState;
  data: DataStore;
  reset: () => void;
};
type EvolutionIconProps = {
  increaseType: boolean;
};
export default function Drawer(props: Prettify<DrawerProps>) {
  const [isOpen, setIsOpen] = createSignal(true);
  const trigger = () => setIsOpen((p) => !p);
  const hasStarted = () => props.data.generation > 0;

  const playPauseText = () => (props.clock.play ? "pause" : "play");
  const { xl } = ICON_SIZE;

  const PlayPauseIcon = () => (
    <Show when={props.clock.play} fallback={<Icon width={ICON_SIZE.xl} name="play" />}>
      <Icon width={ICON_SIZE.xl} name="pause" />
    </Show>
  );

  const StatsTooltip: Component = () => {
    return (
      <div class="flex flex-col py-2 px-3 gap-1 w-44 bg-dw-500">
        <div class="flex items-center justify-between z-10 w-full">
          <span>generation : </span>
          <span class="w-fit">{props.data.generation}</span>
        </div>
        <div class="flex items-center justify-between z-10 w-full">
          <span>total cells : </span>
          <span class="w-fit"> {props.data.nAlive + props.data.nDead}</span>
        </div>
        <div class="flex items-center justify-between z-10 w-full gap-2">
          <span>deads : </span>
          <span class="w-fit grid grid-row-1 grid-cols-2 items-center gap-1">{props.data.nDead}</span>
        </div>
        <div class="flex items-center justify-between z-10 w-full gap-2">
          <span>alives : </span>
          <span class="w-fit grid grid-row-1 grid-cols-2 items-center gap-1">{props.data.nAlive}</span>
        </div>
      </div>
    );
  };

  const DelayTooltip = () => {
    const handleSpeedChange = (e: Event) => {
      const newTime = (e.target as HTMLInputElement).valueAsNumber;
      props.clock.changeSpeed(newTime);
    };
    return <Range onChange={handleSpeedChange} value={props.clock.speed} max={MAX_DELAY} min={MIN_DELAY} />;
  };

  const RandomTooltip = () => {
    const handleRandomChange = (e: Event) => {
      const newRandom = (e.target as HTMLInputElement).valueAsNumber;
      props.data.setRandom(newRandom);
    };
    return (
      <Range
        onChange={handleRandomChange}
        value={props.data.randomness}
        min={MIN_ALIVE_RANDOM}
        max={MAX_ALIVE_RANDOM}
      />
    );
  };

  const StandardTooltip: Component<{ children: JSX.Element }> = (props) => (
    <div class="flex h-fit w-40 p-2 bg-dw-500">
      <span class="text-balance">{props.children}</span>
    </div>
  );

  return (
    <Wrapper trigger={trigger} open={isOpen()}>
      <Header>
        <IconButton onClick={trigger} width={xl} name="chevron" classes="hover:bg-dw-300 p-1 rounded-full" />
      </Header>
      <Separator />
      <Group>
        <Item
          onClick={props.clock.playPause}
          tooltip={<div class="w-fit pe-3 ps-3 flex place-items-center h-full bg-dw-500">{playPauseText()}</div>}
        >
          <PlayPauseIcon />
        </Item>

        <Item
          tooltip={<StandardTooltip>reset the data to a new original fresh random data</StandardTooltip>}
          onClick={props.reset}
        >
          <Icon width={xl} name="reset" />
        </Item>
      </Group>
      <Separator />
      <Group>
        {/* <Item
          tooltip={<StandardTooltip>shuffle this data, randomly adding a pulse of life</StandardTooltip>}
          onClick={props.data.shuffle}
        >
          <Icon width={xl} name={"baby"} />
        </Item> */}
        <Item
          tooltip={
            <StandardTooltip>
              change the speed of the simulation <DelayTooltip />
            </StandardTooltip>
          }
        >
          <Icon width={xl} name="speed" />
        </Item>
        <Item
          tooltip={
            <StandardTooltip>
              change the ratio between alive cells and dead cells when reseting the data
              <RandomTooltip />
            </StandardTooltip>
          }
        >
          <Icon width={xl} name="random" />
        </Item>
      </Group>
      <Separator />
      <Group>
        <Item tooltip={<StatsTooltip />}>
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
};
const Range: VoidComponent<RangeProps> = (props) => {
  const min = props.min === 0 ? 0 : props.min || 10;
  const max = props.max || 1000;
  return (
    <input type="range" class="w-full" onChange={(e) => props.onChange(e)} max={max} min={min} value={props.value} />
  );
};

const Spacer = () => <div class="flex-grow"></div>;
