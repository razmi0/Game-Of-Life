/* eslint-disable */

type FunctionWithParams<T> = (params: T) => void;

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

type Milestones = [string | number, string | number, string | number, string | number];

type DrawShapeType = {
  context: CanvasRenderingContext2D;
  x: number;
  y: number;
  w: number;
  h: number;
};

type UserAgentInfo = {
  userAgent: string;
  battery: number | null | string;
  batteryChange: number;
  platform: string;
  hardwareConcurrency: number;
  deviceMemory: number;
  availableThreads: number;
};

type Prettify<T> = {
  [K in keyof T]: T[K];
} & {};
