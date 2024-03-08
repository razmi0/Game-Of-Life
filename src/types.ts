type DrawShapeType = {
  context: CanvasRenderingContext2D;
  x: number;
  y: number;
  cellSize: number;
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
