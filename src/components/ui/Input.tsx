type InputColorProps = {
  value: string;
  label: string;
  disabled?: boolean;
  id: string;
  class?: string;
  hiddenLabel: boolean;
  onInput?: (e: Event) => void;
  onChange?: (e: Event) => void;
  onBlur?: (e: Event) => void;
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
        onInput={(e) => props.onInput?.(e)}
        onChange={(e) => props.onChange?.(e)}
        onBlur={(e) => props.onBlur?.(e)}
      />
    </>
  );
};
