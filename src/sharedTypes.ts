/* eslint-disable */
import { Accessor } from "solid-js";
import type { EnumToolsType } from "./hooks/usePainter";

export type PaintCellType = {
  x: number;
  y: number;
  paintSize: number;
  tool: EnumToolsType;
  penColor: string;
};

export type RangeProps = {
  onChange: (e: Event) => void;
  onInput?: (e: Event) => void;
  value?: number;
  min?: number;
  max?: number;
  class?: string;
  aria?: string;
  milestones?: boolean | Partial<Milestones>;
  step?: number;
};

export type ColorHook = {
  palette: () => string[];
  maxColors: () => number;
  backgroundColor: Accessor<string>;
  seeCorpse: Accessor<boolean>;
  /** ACTIONS */
  toggleCorpse: () => void;
  setBackgroundColor: (color: string) => void;
  findColor: (i: number) => string;
  addColor: (color: string) => void;
  removeColor: (index: number) => void;
  patchColor: (color: string, index: number) => void;
  applyRandomColors: () => void;
  changeColorAtIndex: (color: string, index: number) => void;
  greyScaledHex: (index: number) => string;
};
