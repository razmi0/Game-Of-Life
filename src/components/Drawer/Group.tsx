import type { JSX } from "solid-js";
import { Show, createSignal, type Component } from "solid-js";
import { ICON_SIZE } from "../../data";
import Icon from "../ui/Icons";

type GroupProps = {
  defaultTitle?: string;
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
  };

  const PlusIcon = () => <Icon width={ICON_SIZE.xs} name={open() ? "minus" : "plus"} />;
  const PinIcon = () => (
    <div
      classList={{ ["bg-dw-400"]: pin() }}
      onClick={pinIt}
      role="button"
      tabindex="0"
      onKeyDown={(e: KeyboardEvent) => {
        if (e.key === "Enter" || e.key === " ") {
          pinIt(e);
        }
      }}
    >
      <Icon width={ICON_SIZE.xs} name="pin" />
    </div>
  );

  const hasTitle = !!props.defaultTitle;

  return (
    <div class="my-3 z-50 bg-dw-500">
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
          <h4 class="uppercase monserrat tracking-widest text-xs font-bold">{props.defaultTitle}</h4>
        </GroupHeader>
      </Show>
      <Show when={open()}>
        <div class={`flex flex-col mt-1 ${props.classes || ""}`}>{props.children}</div>
      </Show>
    </div>
  );
};

type GroupHeaderProps = {
  left?: JSX.Element;
  right?: JSX.Element;
  children: JSX.Element;
  onClick: () => void;
};

const GroupHeader: Component<GroupHeaderProps> = (props) => {
  const handler = () => {
    props.onClick();
  };
  return (
    <button
      class="gap-2 flex flex-row justify-start w-full items-center text-dw-300 hover:text-dw-200 "
      onClick={handler}
    >
      <div class="ps-1 ">{props.left}</div>
      <div>{props.children}</div>
      <Spacer />
      <div class="pe-1 flex gap-1 ">{props.right}</div>
    </button>
  );
};

const Spacer = () => <div class="flex-grow" />;

export default Group;
