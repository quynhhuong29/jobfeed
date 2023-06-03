import { useEffect, useState } from "react";

export function useDebounce(value: string | number, timeout: number, callback: any) {
  const [timer, setTimer] = useState<NodeJS.Timeout>();

  const clearTimer = () => {
    if (timer) {
      clearTimeout(timer);
    }
  };

  useEffect(() => {
    clearTimer();

    if (value && callback) {
      const newTimer = setTimeout(callback, timeout);
      setTimer(newTimer);
    }
  }, [value]);
}
