export const debounce = (fn: Function, delay: number) => {
  let timeoutId: number;
  return function (...args: any) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};
