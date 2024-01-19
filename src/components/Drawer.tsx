import { Portal } from "solid-js/web";
import { createSignal, onCleanup, onMount } from "solid-js";
import Wrapper from "./Drawer/Content";
import Header from "./Drawer/Header";
import Body from "./Drawer/Body";
import Group from "./Drawer/Group";
import Item from "./Drawer/Item";
import { IconButton } from "./Buttons";
import type { JSX, VoidComponent } from "solid-js";
import Icon, { IconNames } from "./Icons";

const portalNode = document.getElementById("portal")! as HTMLDivElement;
let ref: HTMLDivElement;
const title = "Controls";
const subtitle = "monitoring and control";

type DrawerProps = {
  playPause: () => void;
  reset: () => void;
};
export default function Drawer(props: DrawerProps) {
  const [isOpen, setIsOpen] = createSignal(false);
  const trigger = () => setIsOpen(true);

  const ChevronDown = (
    <IconButton onClick={trigger} width={25} height={25} name="chevron" classes="hover:bg-dw-300 p-1 rounded-full" />
  );

  const drawerIcons: Partial<Record<IconNames, JSX.Element>> = {
    play: <Icon width={25} height={25} name="play" />,
    reset: <Icon width={23} height={23} name="reset" />,
    random: <Icon width={25} height={25} name="random" />,
    gear: <Icon width={23} height={23} name="gear" />,
    speed: <Icon width={25} height={25} name="speed" />,
    shuffle: <Icon width={25} height={25} name="shuffle" />,
  };

  onMount(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref && !ref.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    onCleanup(() => document.removeEventListener("mousedown", handleClickOutside));
  });

  return (
    <Portal mount={portalNode}>
      <Wrapper trigger={trigger} open={isOpen()} ref={ref}>
        <Header title={title} subtitle={subtitle} right={ChevronDown} />
        <Body>
          <Group title="Control">
            <Item left={drawerIcons.play} onClick={props.playPause}>
              Play
            </Item>
            <Item left={drawerIcons.shuffle} onClick={props.reset}>
              Random
            </Item>
            <Item left={drawerIcons.reset}>Reset</Item>
          </Group>
          <Group title="Settings" left={drawerIcons.gear}>
            <Item left={drawerIcons.speed} right={59} label="speed">
              <Range onChange={console.log} />
            </Item>
            <Item left={drawerIcons.random}>Item 2.2</Item>
          </Group>
          <Group title="Third set">
            <Item>Item 3.1</Item>
            <Item>Item 3.2</Item>
          </Group>
        </Body>
      </Wrapper>
    </Portal>
  );
}

type RangeProps = {
  onChange: () => void;
};
const Range: VoidComponent<RangeProps> = (props) => {
  return <input type="range" onChange={props.onChange} max={100} min={10} />;
};
