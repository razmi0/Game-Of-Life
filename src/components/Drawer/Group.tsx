import { Component, createEffect, createSignal, Show } from "solid-js";
import type { JSX } from "solid-js";
import Icon from "../Icons";
import { ICON_SIZE } from "../../data";
import Draggable from "./draggable/Draggable";

type GroupProps = {
  title?: string;
  children: JSX.Element;
  left?: JSX.Element;
  classes?: string;
};
const Group: Component<GroupProps> = (props) => {
  const [open, setOpen] = createSignal(true);
  const [pin, setPin] = createSignal(false);

  const trigger = () => setOpen((p) => !p);
  const pinIt = (e: Event) => {
    setPin((p) => !p);
    e.stopImmediatePropagation();
    console.log("openpin");
  };

  const PlusIcon = () => <Icon width={ICON_SIZE.xs} name={open() ? "minus" : "plus"} />;
  const PinIcon = () => (
    <div classList={{ ["bg-dw-400"]: pin() }} onClick={pinIt}>
      <Icon width={ICON_SIZE.xs} name="pin" />
    </div>
  );

  const hasTitle = !!props.title;

  createEffect(() => {
    console.log(pin());
  });

  return (
    <Draggable enabled={pin()}>
      <div class="my-3 mt-4" classList={{ ["bg-dw-500 p-2"]: pin() }}>
        <Show when={hasTitle}>
          <GroupHeader
            right={
              <>
                <PinIcon />
                <PlusIcon />
              </>
            }
            left={props.left}
            onClick={trigger}
          >
            <h4 class="uppercase monserrat tracking-widest text-xs font-bold">{props.title}</h4>
          </GroupHeader>
        </Show>
        <Show when={open()}>
          <div class={`py-2 flex flex-col ps-1 ${props.classes || ""}`}>{props.children}</div>
        </Show>
      </div>
    </Draggable>
  );
};

type GroupHeaderProps = {
  left?: JSX.Element;
  right?: JSX.Element;
  children: JSX.Element;
  onClick: () => void;
};

const GroupHeader: Component<GroupHeaderProps> = (props) => {
  return (
    <button
      class="gap-2 flex flex-row justify-start w-full items-center text-dw-300 hover:text-dw-200 "
      onClick={props.onClick}
    >
      <div class="ps-1 ">{props.left}</div>
      <div>{props.children}</div>
      <Spacer />
      <div class="pe-1 flex gap-1 ">{props.right}</div>
    </button>
  );
};

const Spacer = () => <div class="flex-grow"></div>;

export default Group;
