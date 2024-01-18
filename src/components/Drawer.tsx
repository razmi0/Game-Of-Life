import { Portal } from "solid-js/web";
import { For, Show, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import type { Accessor, Component, FlowComponent, JSX, VoidComponent } from "solid-js";
import Icon from "./Icons";
import Wrapper from "./Drawer/Content";
import Header from "./Drawer/Header";
import Body from "./Drawer/Body";
import Group from "./Drawer/Group";
import Item from "./Drawer/Item";

const portalNode = document.getElementById("portal")! as HTMLDivElement;
let ref: HTMLDivElement;
const title = "Title";
const subtitle = "Subtitle";

export default function () {
  const [isOpen, setIsOpen] = createSignal(true);
  const trigger = () => setIsOpen(true);

  // const leftIcon = (
  //   <div class="bg-dw-200 border-2 p-2 rounded-lg border-dw-300 opacity-80">
  //     <Icon width={25} height={25} name="squares" />
  //   </div>
  // );
  let leftIcon: JSX.Element;
  const rightIcon = <Icon width={25} height={25} name="chevron" />;

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
        <Header title={title} subtitle={subtitle} leftIcon={leftIcon} rightIcon={rightIcon} />
        <Body>
          <Group title="First set">
            <Item>Item 1</Item>
            <Item>Item 2</Item>
          </Group>
          <Group title="Second set">
            <Item>Item 2.1</Item>
            <Item>Item 2.2</Item>
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
