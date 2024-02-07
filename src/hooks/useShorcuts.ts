import { onCleanup, onMount } from "solid-js";

export type Shortcut = {
  key: string;
  action: () => void;
  ctrl?: boolean;
};

const useShorcuts = (shortcuts: Shortcut[]) => {
  const handleKeyDown = (event: KeyboardEvent) => {
    shortcuts.map((shortcut) => {
      if (shortcut.ctrl && !event.ctrlKey) return;
      if (event.key === shortcut.key) {
        shortcut.action();
      }
    });
  };

  onMount(() => {
    window.addEventListener("keydown", handleKeyDown, { passive: true });
    onCleanup(() => window.removeEventListener("keydown", handleKeyDown));
  });
};

export default useShorcuts;
