import { createSignal } from "solid-js";

const userAgentInit: UserAgentInfo = {
  userAgent: "",
  battery: null,
  batteryChange: 0,
  platform: "",
  hardwareConcurrency: 0,
  deviceMemory: 0,
  availableThreads: 0,
};

const useAgent = () => {
  const [navInfo, setNavInfo] = createSignal<UserAgentInfo>(userAgentInit);

  const getBatteryInfo = async () => {
    let battery: null | number | string = null;
    let startBattery: null | number = null;

    if ("getBattery" in navigator) {
      const batteryInfo = await (navigator as any).getBattery();
      battery = batteryInfo ? batteryInfo.level * 100 : null;
      if (startBattery === null) startBattery = battery;
    } else if ("battery" in navigator) {
      const batteryInfo = (navigator as any).battery;
      battery = batteryInfo ? batteryInfo.level * 100 : null;
      if (startBattery === null) startBattery = battery;
    } else {
      battery = "unknown";
    }

    setNavInfo((p) => {
      if (p.battery !== battery && startBattery !== null && battery !== null && typeof battery === "number") {
        const batteryChange = battery - startBattery;
        return { ...p, battery, batteryChange };
      }
      return { ...p, battery };
    });
  };

  const getNavigatorInfo = () => {
    //@ts-ignore
    const platform = window.navigator?.userAgentData?.platform ?? "unknown";
    const userAgent = window.navigator?.userAgent ?? "unknown";
    const hardwareConcurrency = window.navigator?.hardwareConcurrency ?? 0;
    //@ts-ignore
    const deviceMemory = window.navigator?.deviceMemory ?? 0;
    const availableThreads = hardwareConcurrency && deviceMemory ? hardwareConcurrency * deviceMemory : 0;

    setNavInfo((prev) => ({ ...prev, userAgent, platform, hardwareConcurrency, deviceMemory, availableThreads }));
  };

  getNavigatorInfo();
  getBatteryInfo();

  return { navInfo, refreshBatteryInfo: getBatteryInfo };
};

export default useAgent;
