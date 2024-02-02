import { createSignal, Show, JSXElement } from "solid-js";
import Separator from "./Drawer/Separator";

type DebuggerPanelProps = {
  children: JSXElement;
};

const DebuggerPanel = (props: DebuggerPanelProps) => {
  const [open, setOpen] = createSignal(false);

  return (
    <div class="absolute top-0 right-0 m-5 z-50">
      <div class=" py-1 px-2 flex flex-col bg-dw-300 min-w-64 max-w-64 opacity-80">
        <div class="h-fit w-full flex flex-row-reverse">
          <button class="hover:bg-dw-200 rounded-full w-6 h-6" onClick={() => setOpen((p) => !p)}>
            <Show when={open()} fallback={<>I</>}>
              O
            </Show>
          </button>
        </div>
        <Separator classes="bg-dw-500 w-full" />
        <Show when={open()}>
          <div class="flex gap-1 flex-wrap">{props.children}</div>
        </Show>
      </div>
    </div>
  );
};

export default DebuggerPanel;
