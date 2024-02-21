export const debounce = (fn: Function, delay: number) => {
  let timeoutId: number;
  return function (...args: any) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

export async function getNavigatorInfo() {
  let battery: null | number = null;

  if ("getBattery" in navigator) {
    const batteryInfo = await (navigator as any).getBattery();
    battery = batteryInfo ? batteryInfo.level * 100 : null;
  }

  const platform = window.navigator.userAgentData.platform;
  const userAgent = window.navigator.userAgent;
  const hardwareConcurrency = window.navigator.hardwareConcurrency;
  const deviceMemory = window.navigator.deviceMemory;
  const availableThreads = hardwareConcurrency * deviceMemory;

  return {
    userAgent,
    battery,
    platform,
    hardwareConcurrency,
    deviceMemory,
    availableThreads,
  };
}
