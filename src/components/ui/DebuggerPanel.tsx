import { JSXElement, Show, createSignal } from "solid-js";
import { ICON_SIZE } from "../../data/index";
import Icon from "./Icons";

type DebuggerPanelProps = {
  children: JSXElement;
};

const DebuggerPanel = (props: DebuggerPanelProps) => {
  const [open, setOpen] = createSignal(false);

  return (
    <div class="absolute top-0 right-0 m-5 z-50 py-2">
      <div class=" py-2 flex flex-col bg-dw-300 w-fit max-w-80 rounded-md border-dw-500 border-2">
        <button class="leading-tight w-full px-1" onClick={() => setOpen((p) => !p)}>
          <Show when={open()} fallback={<Icon name="plus_circle" width={ICON_SIZE.xl} />}>
            <div class="flex flex-row justify-between items-center mb-2 h-fit hover:bg-dw-200 px-1 rounded-md">
              <div>Debug</div>
              <Spacer />
              <Icon name="minus_circle" width={ICON_SIZE.xl} />
            </div>
          </Show>
        </button>
        <Show when={open()}>
          <div class="flex gap-1 flex-wrap child:min-w-36 border-t-[2px] border-dw-500 pt-2 px-2">{props.children}</div>
        </Show>
      </div>
    </div>
  );
};

const Spacer = () => <div class="flex-grow" />;

export default DebuggerPanel;
