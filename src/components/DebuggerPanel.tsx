import { createSignal, Show, JSXElement } from "solid-js";
import Separator from "./Drawer/Separator";
import Icon from "./Icons";
import { ICON_SIZE } from "../data/index";

type DebuggerPanelProps = {
  children: JSXElement;
};

const DebuggerPanel = (props: DebuggerPanelProps) => {
  const [open, setOpen] = createSignal(false);

  return (
    <div class="absolute top-0 right-0 m-5 z-50">
      <div class=" py-1 px-2 flex flex-col bg-dw-300 w-fit max-w-64 opacity-80">
        <button class="hover:bg-dw-200 leading-tight w-full px-1" onClick={() => setOpen((p) => !p)}>
          <Show when={open()} fallback={<Icon name="plus_circle" width={ICON_SIZE.xl} />}>
            <div class="flex flex-row justify-between items-center ">
              <div>DEBUG</div>
              <Spacer />
              <Icon name="minus_circle" width={ICON_SIZE.xl} />
            </div>
          </Show>
        </button>
        <Show when={open()}>
          <Separator class="bg-dw-500 w-full h-[2px] m-0" />
          <div class="flex gap-1 flex-wrap">{props.children}</div>
        </Show>
      </div>
    </div>
  );
};

const Spacer = () => <div class="flex-grow"></div>;

export default DebuggerPanel;
