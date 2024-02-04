import { createSignal, Show, JSXElement } from "solid-js";
import Separator from "./Drawer/Separator";

type DebuggerPanelProps = {
  children: JSXElement;
};

const DebuggerPanel = (props: DebuggerPanelProps) => {
  const [open, setOpen] = createSignal(true);

  return (
    <div class="absolute top-0 right-0 m-5 z-50">
      <div class=" py-1 px-2 flex flex-col bg-dw-300 w-fit max-w-64 opacity-80">
        {/* <div class="h-fit w-full flex flex-row-reverse"> */}
        <button class="hover:bg-dw-200  h-5 leading-tight w-full px-1" onClick={() => setOpen((p) => !p)}>
          <Show when={open()} fallback={<>I</>}>
            <div class="flex flex-row justify-between ">
              <div>debug</div>
              <Spacer />
              <div>0</div>
            </div>
          </Show>
        </button>
        {/* </div> */}
        <Show when={open()}>
          <Separator classes="bg-dw-500 w-full h-[2px] m-0" />

          <div class="flex gap-1 flex-wrap">{props.children}</div>
        </Show>
      </div>
    </div>
  );
};

const Spacer = () => <div class="flex-grow"></div>;

export default DebuggerPanel;
