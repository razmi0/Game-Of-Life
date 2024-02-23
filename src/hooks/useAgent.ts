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
    let battery: null | number = null;
    let startBattery: null | number = null;

    if ("getBattery" in navigator) {
      const batteryInfo = await (navigator as any).getBattery();
      battery = batteryInfo ? batteryInfo.level * 100 : null;
      if (startBattery === null) startBattery = battery;
    }

    setNavInfo((p) => {
      if (p.battery !== battery && startBattery !== null && battery !== null) {
        const batteryChange = battery - startBattery;
        return { ...p, battery, batteryChange };
      }
      return { ...p, battery };
    });
  };

  const getNavigatorInfo = () => {
    //@ts-ignore
    const platform = window.navigator.userAgentData.platform;
    const userAgent = window.navigator.userAgent;
    const hardwareConcurrency = window.navigator.hardwareConcurrency;
    //@ts-ignore
    const deviceMemory = window.navigator.deviceMemory;
    const availableThreads = hardwareConcurrency * deviceMemory;

    setNavInfo((prev) => ({ ...prev, userAgent, platform, hardwareConcurrency, deviceMemory, availableThreads }));
  };

  getNavigatorInfo();
  getBatteryInfo();

  return { navInfo, refreshBatteryInfo: getBatteryInfo };
};

export default useAgent;
