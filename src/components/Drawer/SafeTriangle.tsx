import { Component } from "solid-js";

type SafeTriangleProps = {
  mouseX: number;
  mouseY: number;
  submenuY: number;
  submenuHeight: number;
  svgWidth: number;
  svgHeight: number;
};
const SvgSafeTriangle: Component<SafeTriangleProps> = (props) => {
  return (
    <svg
      class={`fixed z-10`}
      id="svg-safe-area"
      style={`position: fixed;
        width: ${props.svgWidth};
        height: ${props.submenuHeight};
        pointer-events: none;
        z-index: 2;
        top: ${props.submenuY - 125};
        left: ${props.svgWidth - 50};
      `}
    >
      {/* Safe Area */}
      <path
        style={`pointer-events: auto;`}
        stroke="red"
        stroke-width="0.4"
        fill="rgb(114 140 89 / 0.3)"
        d={`M 0, ${props.mouseY - props.submenuY} 
        L ${props.svgWidth},${props.svgHeight}
        L ${props.svgWidth},0 
        z`}
      />
    </svg>
  );
};

export default SvgSafeTriangle;
