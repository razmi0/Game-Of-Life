import { Portal } from "solid-js/web";
import { For, Show, createEffect, createSignal, onCleanup, onMount } from "solid-js";
import type { Accessor, Component, FlowComponent, JSX, VoidComponent } from "solid-js";

const portalNode = document.getElementById("portal")! as HTMLDivElement;
let ref: HTMLDivElement;
export default function Drawer() {
  const [isOpen, setIsOpen] = createSignal(false);
  const trigger = () => setIsOpen(true);

  onMount(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref && !ref.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    onCleanup(() => document.removeEventListener("mousedown", handleClickOutside));
  });

  return (
    <Portal mount={portalNode}>
      <DrawerWrapper trigger={trigger} open={isOpen()} ref={ref}>
        <DrawerGroup title="First set">
          <DrawerItem>Item 1</DrawerItem>
          <DrawerItem>Item 2</DrawerItem>
        </DrawerGroup>
        <DrawerGroup title="Second set">
          <DrawerItem>Item 2.1</DrawerItem>
          <DrawerItem>Item 2.2</DrawerItem>
        </DrawerGroup>
        <DrawerGroup title="Third set">
          <DrawerItem>Item 3.1</DrawerItem>
          <DrawerItem>Item 3.2</DrawerItem>
        </DrawerGroup>
      </DrawerWrapper>
    </Portal>
  );
}
type DrawerWrapperProps = {
  children: JSX.Element | JSX.Element[];
  trigger: () => void;
  open: boolean;
  ref: HTMLDivElement;
};

const DrawerWrapper: Component<DrawerWrapperProps> = (props) => {
  return (
    <Show when={props.open} fallback={<DrawerTrigger trigger={props.trigger} />}>
      <DrawerContent ref={props.ref} overlay={<DrawerOverlay />}>
        {props.children}
      </DrawerContent>
    </Show>
  );
};

const DrawerOverlay: VoidComponent = () => {
  return <div class="backdrop-blur-sm bg-white/10 w-full h-full"></div>;
};
type DrawerTriggerProps = {
  trigger: () => void;
};
const DrawerTrigger: VoidComponent<DrawerTriggerProps> = (props) => {
  return (
    <div class="absolute top-0 m-5 z-10">
      <button class="w-fit p-3 bg-white rounded-sm" onClick={props.trigger}>
        Controls
      </button>
    </div>
  );
};
type DrawerContentProps = {
  children: JSX.Element[] | JSX.Element;
  ref: HTMLDivElement;
  overlay: JSX.Element;
};
const DrawerContent: Component<DrawerContentProps> = (props) => {
  return (
    <div class="absolute top-0 h-full w-full flex flex-row text-dw-t-2-500">
      <div ref={props.ref} class="h-full bg-dw-500 w-1/3">
        {props.children}
      </div>
      {props.overlay}
    </div>
  );
};

type DrawerGroupProps = {
  title: string;
  children: JSX.Element | JSX.Element[];
};
const DrawerGroup: Component<DrawerGroupProps> = (props) => {
  const [isOpen, setIsOpen] = createSignal(false);
  return (
    <div>
      <div>
        <h4>{props.title}</h4>
        <button onClick={() => setIsOpen((p) => !p)}>See</button>
      </div>
      <div>
        <Show when={isOpen()}>{props.children}</Show>
      </div>
    </div>
  );
};

type DrawerItemProps = {
  children: JSX.Element;
};
const DrawerItem: Component<DrawerItemProps> = (props) => {
  return <>{props.children}</>;
};
