import type { VoidComponent } from "solid-js";
import Icon from "../Icons";

type TriggerProps = {
  trigger: () => void;
};
const Trigger: VoidComponent<TriggerProps> = (props) => {
  return (
    <div class="absolute top-0 m-5 z-10">
      <button class="w-fit p-1 backdrop-blur-sm bg-dw-500 rounded-lg" onClick={props.trigger}>
        <Icon width={50} height={50} name="chevron" />
      </button>
    </div>
  );
};

export default Trigger;
