type InputColorProps = {
  value: string;
  label: string;
  disabled?: boolean;
  id: string;
  class?: string;
  hiddenLabel: boolean;
};
export const InputColor = (props: InputColorProps) => {
  return (
    <>
      <label for={props.id} classList={{ ["sr-only"]: props.hiddenLabel }}>
        {props.label}
      </label>
      <input
        type="color"
        class={`w-8 h-8 cursor-pointer ${props.class ?? ""}`}
        id={props.id}
        name={props.id}
        value={props.value}
        disabled={props.disabled ?? false}
      />
    </>
  );
};
