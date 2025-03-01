export const debounce = <T extends (...args: any[]) => Promise<void> | void>(
  func: T,
  delay: number = 500
): ((...args: Parameters<T>) => void) => {
  let timer: ReturnType<typeof setTimeout>;

  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      void func(...args);
    }, delay);
  };
};
