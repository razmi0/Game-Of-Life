import Canvas from "./components/Canvas";
import useScreen from "./useScreen";
import type { Component } from "solid-js";

const App: Component = () => {
  const screen = useScreen();
  return <Canvas screen={screen} />;
};

export default App;
