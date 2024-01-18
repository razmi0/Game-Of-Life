import Canvas from "./components/Canvas";
import useScreen from "./useScreen";
import type { Component } from "solid-js";
import Drawer from "./components/Drawer";

const App: Component = () => {
  const screen = useScreen();
  return (
    <>
      <Drawer />
      <Canvas screen={screen} />
    </>
  );
};

export default App;
