import type { VoidComponent } from "solid-js";

type TriggerProps = {
  trigger: () => void;
};
const Trigger: VoidComponent<TriggerProps> = (props) => {
  return (
    <div class="absolute top-0 m-5 z-10">
      <button class="w-fit p-3 bg-white rounded-sm" onClick={props.trigger}>
        Controls
      </button>
    </div>
  );
};

export default Trigger;
